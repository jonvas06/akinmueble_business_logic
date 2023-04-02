import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Property,
  OfferType,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyOfferTypeController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/offer-type', {
    responses: {
      '200': {
        description: 'OfferType belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OfferType)},
          },
        },
      },
    },
  })
  async getOfferType(
    @param.path.number('id') id: typeof Property.prototype.id,
  ): Promise<OfferType> {
    return this.propertyRepository.offerType(id);
  }
}
