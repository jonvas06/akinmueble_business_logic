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
  AdvisorStatus,
  Advisor,
} from '../models';
import {AdvisorStatusRepository} from '../repositories';

export class AdvisorStatusAdvisorController {
  constructor(
    @repository(AdvisorStatusRepository) protected advisorStatusRepository: AdvisorStatusRepository,
  ) { }

  @get('/advisor-statuses/{id}/advisors', {
    responses: {
      '200': {
        description: 'Array of AdvisorStatus has many Advisor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Advisor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Advisor>,
  ): Promise<Advisor[]> {
    return this.advisorStatusRepository.advisors(id).find(filter);
  }

  @post('/advisor-statuses/{id}/advisors', {
    responses: {
      '200': {
        description: 'AdvisorStatus model instance',
        content: {'application/json': {schema: getModelSchemaRef(Advisor)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof AdvisorStatus.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Advisor, {
            title: 'NewAdvisorInAdvisorStatus',
            exclude: ['id'],
            optional: ['advisorStatusId']
          }),
        },
      },
    }) advisor: Omit<Advisor, 'id'>,
  ): Promise<Advisor> {
    return this.advisorStatusRepository.advisors(id).create(advisor);
  }

  @patch('/advisor-statuses/{id}/advisors', {
    responses: {
      '200': {
        description: 'AdvisorStatus.Advisor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Advisor, {partial: true}),
        },
      },
    })
    advisor: Partial<Advisor>,
    @param.query.object('where', getWhereSchemaFor(Advisor)) where?: Where<Advisor>,
  ): Promise<Count> {
    return this.advisorStatusRepository.advisors(id).patch(advisor, where);
  }

  @del('/advisor-statuses/{id}/advisors', {
    responses: {
      '200': {
        description: 'AdvisorStatus.Advisor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Advisor)) where?: Where<Advisor>,
  ): Promise<Count> {
    return this.advisorStatusRepository.advisors(id).delete(where);
  }
}
