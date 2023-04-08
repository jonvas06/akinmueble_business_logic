import {BindingScope, injectable} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Property, Request} from '../models';
import {AdvisorRepository, PropertyRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorPropertyService {
  constructor(
    @repository(AdvisorRepository)
    private advisorRepository: AdvisorRepository,
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
  ) {}

  public async createPropertyByAdvisor(
    advisortId: number,
    newProperty: Property,
  ) {
    const oldProperty = await this.propertyRepository.findOne({
      where: {id: newProperty.id, advisorId: advisortId},
      include: [{relation: 'requests'}],
    });

    if (!oldProperty) {
      throw new HttpErrors[403](
        'No tienes permisos para editar esta propiedad',
      );
    }

    const propertyRequest = oldProperty.requests;

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
      newProperty as Property,
      oldProperty,
      propertyRequest,
    );
    this.validateChangeOfferType(
      newProperty as Property,
      oldProperty,
      propertyRequest,
    );
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
}
