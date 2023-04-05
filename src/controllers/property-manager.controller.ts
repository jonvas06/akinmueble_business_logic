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
import {PropertyManager} from '../models';
import {PropertyManagerRepository} from '../repositories';

export class PropertyManagerController {
  constructor(
    @repository(PropertyManagerRepository)
    public propertyManagerRepository : PropertyManagerRepository,
  ) {}

  @post('/property-managers')
  @response(200, {
    description: 'PropertyManager model instance',
    content: {'application/json': {schema: getModelSchemaRef(PropertyManager)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyManager, {
            title: 'NewPropertyManager',
            exclude: ['id'],
          }),
        },
      },
    })
    propertyManager: Omit<PropertyManager, 'id'>,
  ): Promise<PropertyManager> {
    return this.propertyManagerRepository.create(propertyManager);
  }

  @get('/property-managers/count')
  @response(200, {
    description: 'PropertyManager model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PropertyManager) where?: Where<PropertyManager>,
  ): Promise<Count> {
    return this.propertyManagerRepository.count(where);
  }

  @get('/property-managers')
  @response(200, {
    description: 'Array of PropertyManager model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PropertyManager, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PropertyManager) filter?: Filter<PropertyManager>,
  ): Promise<PropertyManager[]> {
    return this.propertyManagerRepository.find(filter);
  }

  @patch('/property-managers')
  @response(200, {
    description: 'PropertyManager PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyManager, {partial: true}),
        },
      },
    })
    propertyManager: PropertyManager,
    @param.where(PropertyManager) where?: Where<PropertyManager>,
  ): Promise<Count> {
    return this.propertyManagerRepository.updateAll(propertyManager, where);
  }

  @get('/property-managers/{id}')
  @response(200, {
    description: 'PropertyManager model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PropertyManager, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PropertyManager, {exclude: 'where'}) filter?: FilterExcludingWhere<PropertyManager>
  ): Promise<PropertyManager> {
    return this.propertyManagerRepository.findById(id, filter);
  }

  @patch('/property-managers/{id}')
  @response(204, {
    description: 'PropertyManager PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyManager, {partial: true}),
        },
      },
    })
    propertyManager: PropertyManager,
  ): Promise<void> {
    await this.propertyManagerRepository.updateById(id, propertyManager);
  }

  @put('/property-managers/{id}')
  @response(204, {
    description: 'PropertyManager PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() propertyManager: PropertyManager,
  ): Promise<void> {
    await this.propertyManagerRepository.replaceById(id, propertyManager);
  }

  @del('/property-managers/{id}')
  @response(204, {
    description: 'PropertyManager DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.propertyManagerRepository.deleteById(id);
  }
}
