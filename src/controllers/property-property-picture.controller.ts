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
  Property,
  PropertyPicture,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyPropertyPictureController {
  constructor(
    @repository(PropertyRepository) protected propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/property-pictures', {
    responses: {
      '200': {
        description: 'Array of Property has many PropertyPicture',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PropertyPicture)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PropertyPicture>,
  ): Promise<PropertyPicture[]> {
    return this.propertyRepository.propertyPictures(id).find(filter);
  }

  @post('/properties/{id}/property-pictures', {
    responses: {
      '200': {
        description: 'Property model instance',
        content: {'application/json': {schema: getModelSchemaRef(PropertyPicture)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Property.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyPicture, {
            title: 'NewPropertyPictureInProperty',
            exclude: ['id'],
            optional: ['propertyId']
          }),
        },
      },
    }) propertyPicture: Omit<PropertyPicture, 'id'>,
  ): Promise<PropertyPicture> {
    return this.propertyRepository.propertyPictures(id).create(propertyPicture);
  }

  @patch('/properties/{id}/property-pictures', {
    responses: {
      '200': {
        description: 'Property.PropertyPicture PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PropertyPicture, {partial: true}),
        },
      },
    })
    propertyPicture: Partial<PropertyPicture>,
    @param.query.object('where', getWhereSchemaFor(PropertyPicture)) where?: Where<PropertyPicture>,
  ): Promise<Count> {
    return this.propertyRepository.propertyPictures(id).patch(propertyPicture, where);
  }

  @del('/properties/{id}/property-pictures', {
    responses: {
      '200': {
        description: 'Property.PropertyPicture DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PropertyPicture)) where?: Where<PropertyPicture>,
  ): Promise<Count> {
    return this.propertyRepository.propertyPictures(id).delete(where);
  }
}
