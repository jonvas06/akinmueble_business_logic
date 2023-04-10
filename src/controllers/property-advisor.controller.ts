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
  Advisor,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyAdvisorController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/advisor', {
    responses: {
      '200': {
        description: 'Advisor belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Advisor)},
          },
        },
      },
    },
  })
  async getAdvisor(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<Advisor> {
    return this.propertyRepository.advisor(id);
  }
}
