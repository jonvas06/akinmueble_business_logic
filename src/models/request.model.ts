import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Advisor} from './advisor.model';
import {Customer} from './customer.model';
import {Property} from './property.model';
import {Report} from './report.model';
import {RequestStatus} from './request-status.model';
import {RequestType} from './request-type.model';

@model({
  settings: {
    foreignKeys: {
      fk_request_propertyId: {
        name: 'fk_request_propertyId',
        entity: 'Property',
        entityKey: 'id',
        foreignKey: 'propertyId',
      },
      fk_request_advisorId: {
        name: 'fk_request_advisorId',
        entity: 'Advisor',
        entityKey: 'id',
        foreignKey: 'advisorId',
      },
      fk_request_requestTypeId: {
        name: 'fk_request_requestTypeId',
        entity: 'RequestType',
        entityKey: 'id',
        foreignKey: 'requestTypeId',
      },
      fk_request_requestStatusId: {
        name: 'fk_request_requestStatusId',
        entity: 'RequestStatus',
        entityKey: 'id',
        foreignKey: 'requestStatusId',
      },
      fk_request_customerId: {
        name: 'fk_request_customerId',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerId',
      },
    },
  },
})
export class Request extends Entity {
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
  code: string;

  @property({
    type: 'date',
    required: true,
  })
  creationDate: string;

  @property({
    type: 'date',
  })
  closeDate?: string;

  @property({
    type: 'string',
  })
  contractSource?: string;

  @belongsTo(() => Property)
  propertyId: number;

  @belongsTo(() => Advisor)
  advisorId: number;

  @belongsTo(() => RequestType)
  requestTypeId: number;

  @belongsTo(() => RequestStatus)
  requestStatusId: number;

  @belongsTo(() => Customer)
  customerId: number;

  @hasMany(() => Report)
  reports: Report[];

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
