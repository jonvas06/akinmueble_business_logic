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
import {PropertyPicture} from '../models';
import {PropertyPictureRepository} from '../repositories';

export class PropertyPictureController {
  constructor(
    @repository(PropertyPictureRepository)
    public propertyPictureRepository : PropertyPictureRepository,
  ) {}

  @post('/property-pictures')
  @response(200, {
    description: 'PropertyPicture model instance',
    content: {'application/json': {schema: getModelSchemaRef(PropertyPicture)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyPicture, {
            title: 'NewPropertyPicture',
            exclude: ['id'],
          }),
        },
      },
    })
    propertyPicture: Omit<PropertyPicture, 'id'>,
  ): Promise<PropertyPicture> {
    return this.propertyPictureRepository.create(propertyPicture);
  }

  @get('/property-pictures/count')
  @response(200, {
    description: 'PropertyPicture model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PropertyPicture) where?: Where<PropertyPicture>,
  ): Promise<Count> {
    return this.propertyPictureRepository.count(where);
  }

  @get('/property-pictures')
  @response(200, {
    description: 'Array of PropertyPicture model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PropertyPicture, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PropertyPicture) filter?: Filter<PropertyPicture>,
  ): Promise<PropertyPicture[]> {
    return this.propertyPictureRepository.find(filter);
  }

  @patch('/property-pictures')
  @response(200, {
    description: 'PropertyPicture PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyPicture, {partial: true}),
        },
      },
    })
    propertyPicture: PropertyPicture,
    @param.where(PropertyPicture) where?: Where<PropertyPicture>,
  ): Promise<Count> {
    return this.propertyPictureRepository.updateAll(propertyPicture, where);
  }

  @get('/property-pictures/{id}')
  @response(200, {
    description: 'PropertyPicture model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PropertyPicture, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PropertyPicture, {exclude: 'where'}) filter?: FilterExcludingWhere<PropertyPicture>
  ): Promise<PropertyPicture> {
    return this.propertyPictureRepository.findById(id, filter);
  }

  @patch('/property-pictures/{id}')
  @response(204, {
    description: 'PropertyPicture PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyPicture, {partial: true}),
        },
      },
    })
    propertyPicture: PropertyPicture,
  ): Promise<void> {
    await this.propertyPictureRepository.updateById(id, propertyPicture);
  }

  @put('/property-pictures/{id}')
  @response(204, {
    description: 'PropertyPicture PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() propertyPicture: PropertyPicture,
  ): Promise<void> {
    await this.propertyPictureRepository.replaceById(id, propertyPicture);
  }

  @del('/property-pictures/{id}')
  @response(204, {
    description: 'PropertyPicture DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.propertyPictureRepository.deleteById(id);
  }
}
