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
import {PropertyStatus} from '../models';
import {PropertyStatusRepository} from '../repositories';

export class PropertyStatusController {
  constructor(
    @repository(PropertyStatusRepository)
    public propertyStatusRepository : PropertyStatusRepository,
  ) {}

  @post('/property-statuses')
  @response(200, {
    description: 'PropertyStatus model instance',
    content: {'application/json': {schema: getModelSchemaRef(PropertyStatus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyStatus, {
            title: 'NewPropertyStatus',
            exclude: ['id'],
          }),
        },
      },
    })
    propertyStatus: Omit<PropertyStatus, 'id'>,
  ): Promise<PropertyStatus> {
    return this.propertyStatusRepository.create(propertyStatus);
  }

  @get('/property-statuses/count')
  @response(200, {
    description: 'PropertyStatus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PropertyStatus) where?: Where<PropertyStatus>,
  ): Promise<Count> {
    return this.propertyStatusRepository.count(where);
  }

  @get('/property-statuses')
  @response(200, {
    description: 'Array of PropertyStatus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PropertyStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PropertyStatus) filter?: Filter<PropertyStatus>,
  ): Promise<PropertyStatus[]> {
    return this.propertyStatusRepository.find(filter);
  }

  @patch('/property-statuses')
  @response(200, {
    description: 'PropertyStatus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyStatus, {partial: true}),
        },
      },
    })
    propertyStatus: PropertyStatus,
    @param.where(PropertyStatus) where?: Where<PropertyStatus>,
  ): Promise<Count> {
    return this.propertyStatusRepository.updateAll(propertyStatus, where);
  }

  @get('/property-statuses/{id}')
  @response(200, {
    description: 'PropertyStatus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PropertyStatus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PropertyStatus, {exclude: 'where'}) filter?: FilterExcludingWhere<PropertyStatus>
  ): Promise<PropertyStatus> {
    return this.propertyStatusRepository.findById(id, filter);
  }

  @patch('/property-statuses/{id}')
  @response(204, {
    description: 'PropertyStatus PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyStatus, {partial: true}),
        },
      },
    })
    propertyStatus: PropertyStatus,
  ): Promise<void> {
    await this.propertyStatusRepository.updateById(id, propertyStatus);
  }

  @put('/property-statuses/{id}')
  @response(204, {
    description: 'PropertyStatus PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() propertyStatus: PropertyStatus,
  ): Promise<void> {
    await this.propertyStatusRepository.replaceById(id, propertyStatus);
  }

  @del('/property-statuses/{id}')
  @response(204, {
    description: 'PropertyStatus DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.propertyStatusRepository.deleteById(id);
  }
}
