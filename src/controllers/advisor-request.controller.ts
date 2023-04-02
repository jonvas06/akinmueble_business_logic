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
  Advisor,
  Request,
} from '../models';
import {AdvisorRepository} from '../repositories';

export class AdvisorRequestController {
  constructor(
    @repository(AdvisorRepository) protected advisorRepository: AdvisorRepository,
  ) { }

  @get('/advisors/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Advisor has many Request',
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
    return this.advisorRepository.requests(id).find(filter);
  }

  @post('/advisors/{id}/requests', {
    responses: {
      '200': {
        description: 'Advisor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Advisor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInAdvisor',
            exclude: ['id'],
            optional: ['advisorId']
          }),
        },
      },
    }) request: Omit<Request, 'id'>,
  ): Promise<Request> {
    return this.advisorRepository.requests(id).create(request);
  }

  @patch('/advisors/{id}/requests', {
    responses: {
      '200': {
        description: 'Advisor.Request PATCH success count',
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
    return this.advisorRepository.requests(id).patch(request, where);
  }

  @del('/advisors/{id}/requests', {
    responses: {
      '200': {
        description: 'Advisor.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request)) where?: Where<Request>,
  ): Promise<Count> {
    return this.advisorRepository.requests(id).delete(where);
  }
}
