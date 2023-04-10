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
import {Advisor} from '../models';
import {AdvisorRepository} from '../repositories';

export class AdvisorController {
  constructor(
    @repository(AdvisorRepository)
    public advisorRepository : AdvisorRepository,
  ) {}

  @post('/advisors')
  @response(200, {
    description: 'Advisor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Advisor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Advisor, {
            title: 'NewAdvisor',
            exclude: ['id'],
          }),
        },
      },
    })
    advisor: Omit<Advisor, 'id'>,
  ): Promise<Advisor> {
    return this.advisorRepository.create(advisor);
  }

  @get('/advisors/count')
  @response(200, {
    description: 'Advisor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Advisor) where?: Where<Advisor>,
  ): Promise<Count> {
    return this.advisorRepository.count(where);
  }

  @get('/advisors')
  @response(200, {
    description: 'Array of Advisor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Advisor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Advisor) filter?: Filter<Advisor>,
  ): Promise<Advisor[]> {
    return this.advisorRepository.find(filter);
  }

  @patch('/advisors')
  @response(200, {
    description: 'Advisor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Advisor, {partial: true}),
        },
      },
    })
    advisor: Advisor,
    @param.where(Advisor) where?: Where<Advisor>,
  ): Promise<Count> {
    return this.advisorRepository.updateAll(advisor, where);
  }

  @get('/advisors/{id}')
  @response(200, {
    description: 'Advisor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Advisor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Advisor, {exclude: 'where'}) filter?: FilterExcludingWhere<Advisor>
  ): Promise<Advisor> {
    return this.advisorRepository.findById(id, filter);
  }

  @patch('/advisors/{id}')
  @response(204, {
    description: 'Advisor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Advisor, {partial: true}),
        },
      },
    })
    advisor: Advisor,
  ): Promise<void> {
    await this.advisorRepository.updateById(id, advisor);
  }

  @put('/advisors/{id}')
  @response(204, {
    description: 'Advisor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() advisor: Advisor,
  ): Promise<void> {
    await this.advisorRepository.replaceById(id, advisor);
  }

  @del('/advisors/{id}')
  @response(204, {
    description: 'Advisor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.advisorRepository.deleteById(id);
  }
}
