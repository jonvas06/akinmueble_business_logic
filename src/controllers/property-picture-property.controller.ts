import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PropertyPicture,
  Property,
} from '../models';
import {PropertyPictureRepository} from '../repositories';

export class PropertyPicturePropertyController {
  constructor(
    @repository(PropertyPictureRepository)
    public propertyPictureRepository: PropertyPictureRepository,
  ) { }

  @get('/property-pictures/{id}/property', {
    responses: {
      '200': {
        description: 'Property belonging to PropertyPicture',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async getProperty(
    @param.path.number('id') id: typeof PropertyPicture.prototype.id,
  ): Promise<Property> {
    return this.propertyPictureRepository.property(id);
  }
}
