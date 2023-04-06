import {Entity, hasMany, model, property} from '@loopback/repository';
import {Property} from './property.model';

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
    jsonSchema: {
      format: 'date',
      pattern: '^(\\d{4})-(\\d{2})-(\\d{2})$',
    },
  })
  dateOfBirth: Date;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<PropertyManager>) {
    super(data);
  }
}

export interface PropertyManagerRelations {
  // describe navigational properties here
}

export type PropertyManagerWithRelations = PropertyManager &
  PropertyManagerRelations;
