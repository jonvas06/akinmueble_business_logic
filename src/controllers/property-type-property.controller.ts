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
  PropertyType,
  Property,
} from '../models';
import {PropertyTypeRepository} from '../repositories';

export class PropertyTypePropertyController {
  constructor(
    @repository(PropertyTypeRepository) protected propertyTypeRepository: PropertyTypeRepository,
  ) { }

  @get('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of PropertyType has many Property',
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
    return this.propertyTypeRepository.properties(id).find(filter);
  }

  @post('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyType model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof PropertyType.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInPropertyType',
            exclude: ['id'],
            optional: ['propertyTypeId']
          }),
        },
      },
    }) property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.propertyTypeRepository.properties(id).create(property);
  }

  @patch('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyType.Property PATCH success count',
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
    return this.propertyTypeRepository.properties(id).patch(property, where);
  }

  @del('/property-types/{id}/properties', {
    responses: {
      '200': {
        description: 'PropertyType.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyTypeRepository.properties(id).delete(where);
  }
}
