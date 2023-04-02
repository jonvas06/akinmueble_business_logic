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
  RequestType,
  Request,
} from '../models';
import {RequestTypeRepository} from '../repositories';

export class RequestTypeRequestController {
  constructor(
    @repository(RequestTypeRepository) protected requestTypeRepository: RequestTypeRepository,
  ) { }

  @get('/request-types/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of RequestType has many Request',
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
    return this.requestTypeRepository.requests(id).find(filter);
  }

  @post('/request-types/{id}/requests', {
    responses: {
      '200': {
        description: 'RequestType model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof RequestType.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInRequestType',
            exclude: ['id'],
            optional: ['requestTypeId']
          }),
        },
      },
    }) request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.requestTypeRepository.requests(id).create(request);
  }

  @patch('/request-types/{id}/requests', {
    responses: {
      '200': {
        description: 'RequestType.Request PATCH success count',
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
    return this.requestTypeRepository.requests(id).patch(request, where);
  }

  @del('/request-types/{id}/requests', {
    responses: {
      '200': {
        description: 'RequestType.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request)) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestTypeRepository.requests(id).delete(where);
  }
}
