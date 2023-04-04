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
import {RequestType} from '../models';
import {RequestTypeRepository} from '../repositories';

export class RequestTypeController {
  constructor(
    @repository(RequestTypeRepository)
    public requestTypeRepository : RequestTypeRepository,
  ) {}

  @post('/request-types')
  @response(200, {
    description: 'RequestType model instance',
    content: {'application/json': {schema: getModelSchemaRef(RequestType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestType, {
            title: 'NewRequestType',
            exclude: ['id'],
          }),
        },
      },
    })
    requestType: Omit<RequestType, 'id'>,
  ): Promise<RequestType> {
    return this.requestTypeRepository.create(requestType);
  }

  @get('/request-types/count')
  @response(200, {
    description: 'RequestType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RequestType) where?: Where<RequestType>,
  ): Promise<Count> {
    return this.requestTypeRepository.count(where);
  }

  @get('/request-types')
  @response(200, {
    description: 'Array of RequestType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RequestType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RequestType) filter?: Filter<RequestType>,
  ): Promise<RequestType[]> {
    return this.requestTypeRepository.find(filter);
  }

  @patch('/request-types')
  @response(200, {
    description: 'RequestType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestType, {partial: true}),
        },
      },
    })
    requestType: RequestType,
    @param.where(RequestType) where?: Where<RequestType>,
  ): Promise<Count> {
    return this.requestTypeRepository.updateAll(requestType, where);
  }

  @get('/request-types/{id}')
  @response(200, {
    description: 'RequestType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RequestType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RequestType, {exclude: 'where'}) filter?: FilterExcludingWhere<RequestType>
  ): Promise<RequestType> {
    return this.requestTypeRepository.findById(id, filter);
  }

  @patch('/request-types/{id}')
  @response(204, {
    description: 'RequestType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestType, {partial: true}),
        },
      },
    })
    requestType: RequestType,
  ): Promise<void> {
    await this.requestTypeRepository.updateById(id, requestType);
  }

  @put('/request-types/{id}')
  @response(204, {
    description: 'RequestType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() requestType: RequestType,
  ): Promise<void> {
    await this.requestTypeRepository.replaceById(id, requestType);
  }

  @del('/request-types/{id}')
  @response(204, {
    description: 'RequestType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestTypeRepository.deleteById(id);
  }
}
