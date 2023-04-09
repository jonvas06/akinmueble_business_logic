import {BindingScope, injectable} from '@loopback/context';
import {Count, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {format} from 'date-fns';
import {Property, PropertyPicture, Request} from '../models';
import {AdvisorRepository, PropertyRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorPropertyService {
  constructor(
    @repository(AdvisorRepository)
    private advisorRepository: AdvisorRepository,
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
  ) {}

  public async editPropertyByAdvisor(
    advisortId: number,
    newProperty: Property,
  ) {
    const oldProperty = await this.propertyRepository.findOne({
      where: {id: newProperty.id, advisorId: advisortId},
      include: [{relation: 'requests'}, {relation: 'propertyPictures'}],
    });

    if (!oldProperty) {
      throw new HttpErrors[403](
        'No tienes permisos para editar esta propiedad',
      );
    }

    const propertyRequest: Request[] = oldProperty.requests;

    if (
      oldProperty.price !== newProperty.price &&
      propertyRequest &&
      propertyRequest.length > 0
    ) {
      throw new HttpErrors[403](
        'No puedes editar el precio de una propiedad que tiene solicitudes',
      );
    }

    if (
      oldProperty.address !== newProperty.address &&
      propertyRequest &&
      propertyRequest.length > 0
    ) {
      throw new HttpErrors[403](
        'No puedes editar la dirección de una propiedad que tiene solicitudes',
      );
    }

    this.validateChangePropertyStatus(
      newProperty,
      oldProperty,
      propertyRequest,
    );
    this.validateChangeOfferType(newProperty, oldProperty, propertyRequest);
    this.validateChangePropertyType(newProperty, oldProperty, propertyRequest);

    await this.advisorRepository
      .properties(advisortId)
      .patch(newProperty, {id: newProperty.id});

    return this.propertyRepository.findById(newProperty.id);
  }

  private validateChangePropertyStatus(
    newProperty: Property,
    oldProperty: Property,
    propertyRequest: Request[],
  ) {
    if (oldProperty.propertyStatusId == newProperty.propertyStatusId) {
      return;
    }

    if (newProperty.propertyStatusId == 5) {
      throw new HttpErrors[403](
        'No tienes permisos para cancelar esta propiedad',
      );
    }

    if (newProperty.propertyStatusId == 2) {
      throw new HttpErrors[403](
        'La propiedad solo podrá tener un estado de vendida cuando una solicitud de venta para la propiedad sea aceptada',
      );
    }

    if (newProperty.propertyStatusId == 3) {
      throw new HttpErrors[403](
        'La propiedad solo podrá tener un estado de rentada cuando una solicitud de renta para la propiedad sea aceptada',
      );
    }

    const propertyPictures: PropertyPicture[] = oldProperty.propertyPictures;
    if (
      oldProperty.propertyStatusId == 4 &&
      newProperty.propertyStatusId == 1 &&
      (!propertyPictures || propertyPictures.length < 1)
    ) {
      throw new HttpErrors[403](
        'No puedes cambiar el estado de una propiedad a disponible si no tiene por lo menos una fotografía',
      );
    }

    if (
      oldProperty.propertyStatusId == 1 &&
      newProperty.propertyStatusId == 4
    ) {
      if (propertyRequest && propertyRequest.length > 0) {
        throw new HttpErrors[403](
          'No puedes cambiar el estado de una propiedad que tiene solicitudes a privada',
        );
      }
    }

    const dateNow: Date = new Date(format(new Date(), 'yyyy-MM-dd'));

    if (
      oldProperty.propertyStatusId == 3 &&
      newProperty.propertyStatusId == 1 &&
      oldProperty.dataOccupied &&
      oldProperty.dataOccupied >= dateNow
    ) {
      throw new HttpErrors[403](
        `No puedes cambiar el estado de una propiedad a disponible si actualmente se encuentra rentada por alguien hasta la fecha ${oldProperty.dataOccupied}`,
      );
    } else if (
      oldProperty.propertyStatusId == 3 &&
      newProperty.propertyStatusId == 1 &&
      oldProperty.dataOccupied &&
      oldProperty.dataOccupied < dateNow
    ) {
      newProperty.dataOccupied = undefined;
    }
  }

  private validateChangeOfferType(
    newProperty: Property,
    oldProperty: Property,
    propertyRequest: Request[],
  ) {
    if (oldProperty.offerTypeId == newProperty.offerTypeId) {
      return;
    }

    if (
      oldProperty.offerTypeId == 1 &&
      newProperty.offerTypeId == 2 &&
      propertyRequest &&
      propertyRequest.length > 0
    ) {
      throw new HttpErrors[403](
        'No puedes cambiar el tipo de oferta de renta a venta de una propiedad que tiene solicitudes',
      );
    }

    if (
      oldProperty.offerTypeId == 2 &&
      newProperty.offerTypeId == 1 &&
      propertyRequest &&
      propertyRequest.length > 0
    ) {
      throw new HttpErrors[403](
        'No puedes cambiar el tipo de oferta de venta a renta de una propiedad que tiene solicitudes',
      );
    }

    if (
      oldProperty.offerTypeId == 3 &&
      (newProperty.offerTypeId == 1 || newProperty.offerTypeId == 2) &&
      propertyRequest &&
      propertyRequest.length > 0
    ) {
      throw new HttpErrors[403](
        'No puedes cambiar el tipo de oferta de venta-renta a solo renta o solo venta de una propiedad que tiene solicitudes',
      );
    }
  }

  private validateChangePropertyType(
    newProperty: Property,
    oldProperty: Property,
    propertyRequest: Request[],
  ) {
    if (oldProperty.propertyTypeId == newProperty.propertyTypeId) {
      return;
    }

    if (propertyRequest && propertyRequest.length > 0) {
      throw new HttpErrors[403](
        'No puedes cambiar el tipo de propiedad a una propiedad que tiene solicitudes',
      );
    }
  }

  public async deletePropertyByAdvisor(
    advisorId: number,
    propertyId: number,
  ): Promise<Count> {
    const property = await this.propertyRepository.findOne({
      where: {id: propertyId, advisorId: advisorId},
      include: [{relation: 'requests'}],
    });

    if (!property) {
      throw new HttpErrors[403](
        'No tienes permisos para eliminar esta propiedad',
      );
    }

    const propertyRequest = property.requests;

    if (propertyRequest && propertyRequest.length > 0) {
      throw new HttpErrors[403](
        'No puedes eliminar una propiedad que tiene solicitudes',
      );
    }

    return this.advisorRepository
      .properties(advisorId)
      .delete({id: propertyId});
  }
}
