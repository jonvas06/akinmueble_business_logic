import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {Request} from '../models';
import {CustomResponse} from '../models/custom-reponse.model';
import {RequestRepository} from '../repositories';
import {RequestService} from '../services/request.service';

export class RequestController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
    @service(RequestService)
    protected requestService: RequestService,
  ) {}

  @post('/requests')
  @response(200, {
    description: 'Request model instance',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequest',
            exclude: ['id'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.requestRepository.create(request);
  }

  @get('/requests/count')
  @response(200, {
    description: 'Request model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Request) where?: Where<Request>): Promise<Count> {
    return this.requestRepository.count(where);
  }

  @get('/requests')
  @response(200, {
    description: 'Array of Request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Request) filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.requestRepository.find(filter);
  }

  @patch('/requests')
  @response(200, {
    description: 'Request PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
    @param.where(Request) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestRepository.updateAll(request, where);
  }

  @get('/requests/{id}')
  @response(200, {
    description: 'Request model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Request, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Request, {exclude: 'where'})
    filter?: FilterExcludingWhere<Request>,
  ): Promise<Request> {
    return this.requestRepository.findById(id, filter);
  }

  @patch('/requests/{id}')
  @response(204, {
    description: 'Request PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
  ): Promise<void> {
    await this.requestRepository.updateById(id, request);
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.assignAction,
    ],
  })
  @patch('/requests/{requestId}/{newAdvisorIid}')
  @response(204, {
    description: 'Request PATCH success',
  })
  async ChangeAdvisor(
    @param.path.number('requestId') requestId: number,
    @param.path.number('newAdvisorIid') newAdvisorId: number,
  ): Promise<CustomResponse> {
    try {
      return this.requestService.changeAdvisor(requestId, newAdvisorId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @put('/requests/{id}')
  @response(204, {
    description: 'Request PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() request: Request,
  ): Promise<void> {
    await this.requestRepository.replaceById(id, request);
  }

  @del('/requests/{id}')
  @response(204, {
    description: 'Request DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.requestRepository.deleteById(id);
  }
}
