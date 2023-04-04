/* eslint-disable @typescript-eslint/naming-convention */
import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Department} from './department.model';
import {Property} from './property.model';

@model()
export class City extends Entity {
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
  cityName: string;

  @belongsTo(() => Department)
  departmentId: number;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<City>) {
    super(data);
  }
}

export interface CityRelations {
  // describe navigational properties here
}

export type CityWithRelations = City & CityRelations;
