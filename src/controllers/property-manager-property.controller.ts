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
  PropertyManager,
  Property,
} from '../models';
import {PropertyManagerRepository} from '../repositories';

export class PropertyManagerPropertyController {
  constructor(
    @repository(PropertyManagerRepository) protected propertyManagerRepository: PropertyManagerRepository,
  ) { }

  @get('/property-managers/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of PropertyManager has many Property',
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
    return this.propertyManagerRepository.properties(id).find(filter);
  }

  @post('/property-managers/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyManager model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof PropertyManager.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInPropertyManager',
            exclude: ['id'],
            optional: ['propertyManagerId']
          }),
        },
      },
    }) property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.propertyManagerRepository.properties(id).create(property);
  }

  @patch('/property-managers/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyManager.Property PATCH success count',
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
    return this.propertyManagerRepository.properties(id).patch(property, where);
  }

  @del('/property-managers/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyManager.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyManagerRepository.properties(id).delete(where);
  }
}
