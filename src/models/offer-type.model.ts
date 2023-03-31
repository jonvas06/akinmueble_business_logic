import {Entity, model, property} from '@loopback/repository';

@model()
export class OfferType extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  offerTypeName: string;


  constructor(data?: Partial<OfferType>) {
    super(data);
  }
}

export interface OfferTypeRelations {
  // describe navigational properties here
}

export type OfferTypeWithRelations = OfferType & OfferTypeRelations;
