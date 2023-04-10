import {Entity, model, property, hasMany} from '@loopback/repository';
import {City} from './city.model';

@model()
export class Department extends Entity {
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
  departmentName: string;

  @hasMany(() => City)
  cities: City[];

  constructor(data?: Partial<Department>) {
    super(data);
  }
}

export interface DepartmentRelations {
  // describe navigational properties here
}

export type DepartmentWithRelations = Department & DepartmentRelations;
