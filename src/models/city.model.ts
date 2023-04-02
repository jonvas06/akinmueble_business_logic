import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Property} from './property.model';
import {Department} from './department.model';

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
  @hasMany(() => Property)
  properties: Property[];

  @belongsTo(() => Department)
  departmentId: number;

  constructor(data?: Partial<City>) {
    super(data);
  }
}

export interface CityRelations {
  // describe navigational properties here
}

export type CityWithRelations = City & CityRelations;
