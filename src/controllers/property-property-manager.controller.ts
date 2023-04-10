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
  PropertyManager,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyPropertyManagerController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/property-manager', {
    responses: {
      '200': {
        description: 'PropertyManager belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PropertyManager)},
          },
        },
      },
    },
  })
  async getPropertyManager(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<PropertyManager> {
    return this.propertyRepository.propertyManager(id);
  }
}
