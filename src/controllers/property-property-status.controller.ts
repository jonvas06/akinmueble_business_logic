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
  PropertyStatus,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyPropertyStatusController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/property-status', {
    responses: {
      '200': {
        description: 'PropertyStatus belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PropertyStatus)},
          },
        },
      },
    },
  })
  async getPropertyStatus(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<PropertyStatus> {
    return this.propertyRepository.propertyStatus(id);
  }
}
