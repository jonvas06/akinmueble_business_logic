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
  RequestType,
} from '../models';
import {RequestRepository} from '../repositories';

export class RequestRequestTypeController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/request-type', {
    responses: {
      '200': {
        description: 'RequestType belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RequestType)},
          },
        },
      },
    },
  })
  async getRequestType(
    @param.path.number('id') id: typeof Request.prototype.id,
  ): Promise<RequestType> {
    return this.requestRepository.requestType(id);
  }
}
