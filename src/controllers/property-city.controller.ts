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
  City,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyCityController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<City> {
    return this.propertyRepository.city(id);
  }
}
