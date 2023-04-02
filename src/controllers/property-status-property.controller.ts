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
  PropertyStatus,
  Property,
} from '../models';
import {PropertyStatusRepository} from '../repositories';

export class PropertyStatusPropertyController {
  constructor(
    @repository(PropertyStatusRepository) protected propertyStatusRepository: PropertyStatusRepository,
  ) { }

  @get('/property-statuses/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of PropertyStatus has many Property',
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
    return this.propertyStatusRepository.properties(id).find(filter);
  }

  @post('/property-statuses/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyStatus model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof PropertyStatus.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInPropertyStatus',
            exclude: ['id'],
            optional: ['propertyStatusId']
          }),
        },
      },
    }) property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.propertyStatusRepository.properties(id).create(property);
  }

  @patch('/property-statuses/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyStatus.Property PATCH success count',
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
    return this.propertyStatusRepository.properties(id).patch(property, where);
  }

  @del('/property-statuses/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyStatus.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyStatusRepository.properties(id).delete(where);
  }
}
