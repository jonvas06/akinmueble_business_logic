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
  Property,
} from '../models';
import {AdvisorRepository} from '../repositories';

export class AdvisorPropertyController {
  constructor(
    @repository(AdvisorRepository) protected advisorRepository: AdvisorRepository,
  ) { }

  @get('/advisors/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of Advisor has many Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.advisorRepository.properties(id).find(filter);
  }

  @post('/advisors/{id}/properties', {
    responses: {
      '200': {
        description: 'Advisor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Advisor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInAdvisor',
            exclude: ['id'],
            optional: ['advisorId']
          }),
        },
      },
    }) property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.advisorRepository.properties(id).create(property);
  }

  @patch('/advisors/{id}/properties', {
    responses: {
      '200': {
        description: 'Advisor.Property PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Partial<Property>,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.advisorRepository.properties(id).patch(property, where);
  }

  @del('/advisors/{id}/properties', {
    responses: {
      '200': {
        description: 'Advisor.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.advisorRepository.properties(id).delete(where);
  }
}
