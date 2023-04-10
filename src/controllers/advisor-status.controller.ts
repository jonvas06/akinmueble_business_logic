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
import {AdvisorStatus} from '../models';
import {AdvisorStatusRepository} from '../repositories';

export class AdvisorStatusController {
  constructor(
    @repository(AdvisorStatusRepository)
    public advisorStatusRepository : AdvisorStatusRepository,
  ) {}

  @post('/advisor-statuses')
  @response(200, {
    description: 'AdvisorStatus model instance',
    content: {'application/json': {schema: getModelSchemaRef(AdvisorStatus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdvisorStatus, {
            title: 'NewAdvisorStatus',
            exclude: ['id'],
          }),
        },
      },
    })
    advisorStatus: Omit<AdvisorStatus, 'id'>,
  ): Promise<AdvisorStatus> {
    return this.advisorStatusRepository.create(advisorStatus);
  }

  @get('/advisor-statuses/count')
  @response(200, {
    description: 'AdvisorStatus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AdvisorStatus) where?: Where<AdvisorStatus>,
  ): Promise<Count> {
    return this.advisorStatusRepository.count(where);
  }

  @get('/advisor-statuses')
  @response(200, {
    description: 'Array of AdvisorStatus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AdvisorStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AdvisorStatus) filter?: Filter<AdvisorStatus>,
  ): Promise<AdvisorStatus[]> {
    return this.advisorStatusRepository.find(filter);
  }

  @patch('/advisor-statuses')
  @response(200, {
    description: 'AdvisorStatus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdvisorStatus, {partial: true}),
        },
      },
    })
    advisorStatus: AdvisorStatus,
    @param.where(AdvisorStatus) where?: Where<AdvisorStatus>,
  ): Promise<Count> {
    return this.advisorStatusRepository.updateAll(advisorStatus, where);
  }

  @get('/advisor-statuses/{id}')
  @response(200, {
    description: 'AdvisorStatus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AdvisorStatus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AdvisorStatus, {exclude: 'where'}) filter?: FilterExcludingWhere<AdvisorStatus>
  ): Promise<AdvisorStatus> {
    return this.advisorStatusRepository.findById(id, filter);
  }

  @patch('/advisor-statuses/{id}')
  @response(204, {
    description: 'AdvisorStatus PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdvisorStatus, {partial: true}),
        },
      },
    })
    advisorStatus: AdvisorStatus,
  ): Promise<void> {
    await this.advisorStatusRepository.updateById(id, advisorStatus);
  }

  @put('/advisor-statuses/{id}')
  @response(204, {
    description: 'AdvisorStatus PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() advisorStatus: AdvisorStatus,
  ): Promise<void> {
    await this.advisorStatusRepository.replaceById(id, advisorStatus);
  }

  @del('/advisor-statuses/{id}')
  @response(204, {
    description: 'AdvisorStatus DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.advisorStatusRepository.deleteById(id);
  }
}
