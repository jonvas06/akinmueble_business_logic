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
import {OfferType} from '../models';
import {OfferTypeRepository} from '../repositories';

export class OfferTypeController {
  constructor(
    @repository(OfferTypeRepository)
    public offerTypeRepository : OfferTypeRepository,
  ) {}

  @post('/offer-types')
  @response(200, {
    description: 'OfferType model instance',
    content: {'application/json': {schema: getModelSchemaRef(OfferType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OfferType, {
            title: 'NewOfferType',
            exclude: ['id'],
          }),
        },
      },
    })
    offerType: Omit<OfferType, 'id'>,
  ): Promise<OfferType> {
    return this.offerTypeRepository.create(offerType);
  }

  @get('/offer-types/count')
  @response(200, {
    description: 'OfferType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OfferType) where?: Where<OfferType>,
  ): Promise<Count> {
    return this.offerTypeRepository.count(where);
  }

  @get('/offer-types')
  @response(200, {
    description: 'Array of OfferType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OfferType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OfferType) filter?: Filter<OfferType>,
  ): Promise<OfferType[]> {
    return this.offerTypeRepository.find(filter);
  }

  @patch('/offer-types')
  @response(200, {
    description: 'OfferType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OfferType, {partial: true}),
        },
      },
    })
    offerType: OfferType,
    @param.where(OfferType) where?: Where<OfferType>,
  ): Promise<Count> {
    return this.offerTypeRepository.updateAll(offerType, where);
  }

  @get('/offer-types/{id}')
  @response(200, {
    description: 'OfferType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OfferType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OfferType, {exclude: 'where'}) filter?: FilterExcludingWhere<OfferType>
  ): Promise<OfferType> {
    return this.offerTypeRepository.findById(id, filter);
  }

  @patch('/offer-types/{id}')
  @response(204, {
    description: 'OfferType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OfferType, {partial: true}),
        },
      },
    })
    offerType: OfferType,
  ): Promise<void> {
    await this.offerTypeRepository.updateById(id, offerType);
  }

  @put('/offer-types/{id}')
  @response(204, {
    description: 'OfferType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() offerType: OfferType,
  ): Promise<void> {
    await this.offerTypeRepository.replaceById(id, offerType);
  }

  @del('/offer-types/{id}')
  @response(204, {
    description: 'OfferType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.offerTypeRepository.deleteById(id);
  }
}
