import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Property} from './property.model';
import {AdvisorStatus} from './advisor-status.model';
import {Request} from './request.model';

@model()
export class Advisor extends Entity {
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
  firtsLastName: string;

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

  @hasMany(() => Property)
  properties: Property[];

  @belongsTo(() => AdvisorStatus)
  advisorStatusId: number;

  @hasMany(() => Request)
  requests: Request[];

  constructor(data?: Partial<Advisor>) {
    super(data);
  }
}

export interface AdvisorRelations {
  // describe navigational properties here
}

export type AdvisorWithRelations = Advisor & AdvisorRelations;
