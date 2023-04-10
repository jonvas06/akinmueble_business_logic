import {Entity, model, property, hasMany} from '@loopback/repository';
import {Property} from './property.model';

@model()
export class OfferType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  offerTypeName: string;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<OfferType>) {
    super(data);
  }
}

export interface OfferTypeRelations {
  // describe navigational properties here
}

export type OfferTypeWithRelations = OfferType & OfferTypeRelations;
