import {Entity, model, property} from '@loopback/repository';

@model()
export class PropertyType extends Entity {
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
  typeName: string;

  @property({
    type: 'string',
    required: false,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  purchasePercentage: number;

  @property({
    type: 'number',
    required: true,
  })
  rentalPercentage: number;

  constructor(data?: Partial<PropertyType>) {
    super(data);
  }
}

export interface PropertyTypeRelations {
  // describe navigational properties here
}

export type PropertyTypeWithRelations = PropertyType & PropertyTypeRelations;
