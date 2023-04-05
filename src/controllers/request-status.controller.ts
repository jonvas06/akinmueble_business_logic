import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {RequestStatus} from '../models';
import {RequestStatusRepository} from '../repositories';

export class RequestStatusController {
  constructor(
    @repository(RequestStatusRepository)
    public requestStatusRepository : RequestStatusRepository,
  ) {}

  @post('/request-statuses')
  @response(200, {
    description: 'RequestStatus model instance',
    content: {'application/json': {schema: getModelSchemaRef(RequestStatus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestStatus, {
            title: 'NewRequestStatus',
            exclude: ['id'],
          }),
        },
      },
    })
    requestStatus: Omit<RequestStatus, 'id'>,
  ): Promise<RequestStatus> {
    return this.requestStatusRepository.create(requestStatus);
  }

  @get('/request-statuses/count')
  @response(200, {
    description: 'RequestStatus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestStatus) where?: Where<RequestStatus>,
  ): Promise<Count> {
    return this.requestStatusRepository.count(where);
  }

  @get('/request-statuses')
  @response(200, {
    description: 'Array of RequestStatus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestStatus) filter?: Filter<RequestStatus>,
  ): Promise<RequestStatus[]> {
    return this.requestStatusRepository.find(filter);
  }

  @patch('/request-statuses')
  @response(200, {
    description: 'RequestStatus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestStatus, {partial: true}),
        },
      },
    })
    requestStatus: RequestStatus,
    @param.where(RequestStatus) where?: Where<RequestStatus>,
  ): Promise<Count> {
    return this.requestStatusRepository.updateAll(requestStatus, where);
  }

  @get('/request-statuses/{id}')
  @response(200, {
    description: 'RequestStatus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestStatus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RequestStatus, {exclude: 'where'}) filter?: FilterExcludingWhere<RequestStatus>
  ): Promise<RequestStatus> {
    return this.requestStatusRepository.findById(id, filter);
  }

  @patch('/request-statuses/{id}')
  @response(204, {
    description: 'RequestStatus PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestStatus, {partial: true}),
        },
      },
    })
    requestStatus: RequestStatus,
  ): Promise<void> {
    await this.requestStatusRepository.updateById(id, requestStatus);
  }

  @put('/request-statuses/{id}')
  @response(204, {
    description: 'RequestStatus PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() requestStatus: RequestStatus,
  ): Promise<void> {
    await this.requestStatusRepository.replaceById(id, requestStatus);
  }

  @del('/request-statuses/{id}')
  @response(204, {
    description: 'RequestStatus DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestStatusRepository.deleteById(id);
  }
}
