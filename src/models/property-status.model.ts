import {Entity, model, property, hasMany} from '@loopback/repository';
import {Property} from './property.model';

@model()
export class PropertyStatus extends Entity {
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
  nameStatus: string;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<PropertyStatus>) {
    super(data);
  }
}

export interface PropertyStatusRelations {
  // describe navigational properties here
}

export type PropertyStatusWithRelations = PropertyStatus &
  PropertyStatusRelations;
