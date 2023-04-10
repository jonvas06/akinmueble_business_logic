import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  RequestStatus,
  Request,
} from '../models';
import {RequestStatusRepository} from '../repositories';

export class RequestStatusRequestController {
  constructor(
    @repository(RequestStatusRepository) protected requestStatusRepository: RequestStatusRepository,
  ) { }

  @get('/request-statuses/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of RequestStatus has many Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Request)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.requestStatusRepository.requests(id).find(filter);
  }

  @post('/request-statuses/{id}/requests', {
    responses: {
      '200': {
        description: 'RequestStatus model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof RequestStatus.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInRequestStatus',
            exclude: ['id'],
            optional: ['requestStatusId']
          }),
        },
      },
    }) request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.requestStatusRepository.requests(id).create(request);
  }

  @patch('/request-statuses/{id}/requests', {
    responses: {
      '200': {
        description: 'RequestStatus.Request PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Partial<Request>,
    @param.query.object('where', getWhereSchemaFor(Request)) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestStatusRepository.requests(id).patch(request, where);
  }

  @del('/request-statuses/{id}/requests', {
    responses: {
      '200': {
        description: 'RequestStatus.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request)) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestStatusRepository.requests(id).delete(where);
  }
}
