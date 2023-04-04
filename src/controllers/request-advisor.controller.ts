import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Request,
  Advisor,
} from '../models';
import {RequestRepository} from '../repositories';

export class RequestAdvisorController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/advisor', {
    responses: {
      '200': {
        description: 'Advisor belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Advisor)},
          },
        },
      },
    },
  })
  async getAdvisor(
    @param.path.number('id') id: typeof Request.prototype.id,
  ): Promise<Advisor> {
    return this.requestRepository.advisor(id);
  }
}
