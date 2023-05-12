import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PropertyType} from '../models';
import {CustomResponse} from '../models/custom-reponse.model';
import {PropertyTypeRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class PropertyTypeService {
  constructor(
    @repository(PropertyTypeRepository)
    protected propertyTypeRepository: PropertyTypeRepository,
  ) {}

  public async CreatePropertyType(
    propertyType: PropertyType,
  ): Promise<CustomResponse> {
    const customResponse: CustomResponse = new CustomResponse();
    const newPropertyType = await this.propertyTypeRepository.create(
      propertyType,
    );

    if (!newPropertyType) {
      throw HttpErrors[400]('No se pudo crear el tipo de propiedad');
    }

    customResponse.ok = true;
    customResponse.message = 'Se creo el tipo de propiedad';
    customResponse.data = newPropertyType;

    return customResponse;
  }
}
