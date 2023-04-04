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
  OfferType,
  Property,
} from '../models';
import {OfferTypeRepository} from '../repositories';

export class OfferTypePropertyController {
  constructor(
    @repository(OfferTypeRepository) protected offerTypeRepository: OfferTypeRepository,
  ) { }

  @get('/offer-types/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of OfferType has many Property',
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
    return this.offerTypeRepository.properties(id).find(filter);
  }

  @post('/offer-types/{id}/properties', {
    responses: {
      '200': {
        description: 'OfferType model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof OfferType.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInOfferType',
            exclude: ['id'],
            optional: ['offerTypeId']
          }),
        },
      },
    }) property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.offerTypeRepository.properties(id).create(property);
  }

  @patch('/offer-types/{id}/properties', {
    responses: {
      '200': {
        description: 'OfferType.Property PATCH success count',
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
    return this.offerTypeRepository.properties(id).patch(property, where);
  }

  @del('/offer-types/{id}/properties', {
    responses: {
      '200': {
        description: 'OfferType.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.offerTypeRepository.properties(id).delete(where);
  }
}
