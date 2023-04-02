import {Entity, model, property} from '@loopback/repository';

@model()
export class PropertyManager extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  secondName?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstLastName: string;

  @property({
    type: 'string',
  })
  secondLastName?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  documentNumber: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'date',
    required: true,
  })
  dateOfBirth: string;

  constructor(data?: Partial<PropertyManager>) {
    super(data);
  }
}

export interface PropertyManagerRelations {
  // describe navigational properties here
}

export type PropertyManagerWithRelations = PropertyManager &
  PropertyManagerRelations;
