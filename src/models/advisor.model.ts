import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {AdvisorStatus} from './advisor-status.model';
import {Property} from './property.model';
import {Request} from './request.model';

@model({
  settings: {
    foreignKeys: {
      fk_advisor_advisorStatusId: {
        name: 'fk_advisor_advisorStatusId',
        entity: 'AdvisorStatus',
        entityKey: 'id',
        foreignKey: 'advisorStatusId',
      },
    },
  },
})
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
    jsonSchema: {
      format: 'date',
      pattern: '^(\\d{4})-(\\d{2})-(\\d{2})$',
    },
  })
  dateOfBirth: Date;

  @belongsTo(() => AdvisorStatus)
  advisorStatusId: number;

  @hasMany(() => Property)
  properties: Property[];

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
