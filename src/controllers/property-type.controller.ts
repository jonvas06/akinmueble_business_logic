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
import {PropertyType} from '../models';
import {PropertyTypeRepository} from '../repositories';

export class PropertyTypeController {
  constructor(
    @repository(PropertyTypeRepository)
    public propertyTypeRepository : PropertyTypeRepository,
  ) {}

  @post('/property-types')
  @response(200, {
    description: 'PropertyType model instance',
    content: {'application/json': {schema: getModelSchemaRef(PropertyType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyType, {
            title: 'NewPropertyType',
            exclude: ['id'],
          }),
        },
      },
    })
    propertyType: Omit<PropertyType, 'id'>,
  ): Promise<PropertyType> {
    return this.propertyTypeRepository.create(propertyType);
  }

  @get('/property-types/count')
  @response(200, {
    description: 'PropertyType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PropertyType) where?: Where<PropertyType>,
  ): Promise<Count> {
    return this.propertyTypeRepository.count(where);
  }

  @get('/property-types')
  @response(200, {
    description: 'Array of PropertyType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PropertyType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PropertyType) filter?: Filter<PropertyType>,
  ): Promise<PropertyType[]> {
    return this.propertyTypeRepository.find(filter);
  }

  @patch('/property-types')
  @response(200, {
    description: 'PropertyType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyType, {partial: true}),
        },
      },
    })
    propertyType: PropertyType,
    @param.where(PropertyType) where?: Where<PropertyType>,
  ): Promise<Count> {
    return this.propertyTypeRepository.updateAll(propertyType, where);
  }

  @get('/property-types/{id}')
  @response(200, {
    description: 'PropertyType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PropertyType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PropertyType, {exclude: 'where'}) filter?: FilterExcludingWhere<PropertyType>
  ): Promise<PropertyType> {
    return this.propertyTypeRepository.findById(id, filter);
  }

  @patch('/property-types/{id}')
  @response(204, {
    description: 'PropertyType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyType, {partial: true}),
        },
      },
    })
    propertyType: PropertyType,
  ): Promise<void> {
    await this.propertyTypeRepository.updateById(id, propertyType);
  }

  @put('/property-types/{id}')
  @response(204, {
    description: 'PropertyType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() propertyType: PropertyType,
  ): Promise<void> {
    await this.propertyTypeRepository.replaceById(id, propertyType);
  }

  @del('/property-types/{id}')
  @response(204, {
    description: 'PropertyType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.propertyTypeRepository.deleteById(id);
  }
}
