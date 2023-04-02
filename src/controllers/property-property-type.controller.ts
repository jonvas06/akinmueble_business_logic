import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Property,
  PropertyType,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyPropertyTypeController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/property-type', {
    responses: {
      '200': {
        description: 'PropertyType belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PropertyType)},
          },
        },
      },
    },
  })
  async getPropertyType(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<PropertyType> {
    return this.propertyRepository.propertyType(id);
  }
}
