import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {PropertyType} from '../models';
import {CustomResponse} from '../models/custom-reponse.model';
import {PropertyTypeRepository} from '../repositories';
import {PropertyTypeService} from '../services/property-type.service';

export class PropertyTypeController {
  constructor(
    @repository(PropertyTypeRepository)
    public propertyTypeRepository: PropertyTypeRepository,
    @service(PropertyTypeService)
    protected propertyTypeService: PropertyTypeService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuPropertyId,
      SecurityConfiguration.actions.createAction,
    ],
  })
  @post('/property-types')
  @response(200, {
    description: 'PropertyType model instance',
    content: {'application/json': {schema: getModelSchemaRef(CustomResponse)}},
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
  ): Promise<CustomResponse> {
    try {
      return await this.propertyTypeService.CreatePropertyType(propertyType);
    } catch (e) {
      throw e;
    }
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
    @param.filter(PropertyType, {exclude: 'where'})
    filter?: FilterExcludingWhere<PropertyType>,
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
