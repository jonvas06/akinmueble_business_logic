import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Property} from './property.model';
import {Report} from './report.model';
import {Advisor} from './advisor.model';
import {RequestType} from './request-type.model';
import {RequestStatus} from './request-status.model';
import {Customer} from './customer.model';

@model()
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

  @hasMany(() => Report)
  reports: Report[];

  @belongsTo(() => Advisor)
  advisorId: number;

  @belongsTo(() => RequestType)
  requestTypeId: number;

  @belongsTo(() => RequestStatus)
  requestStatusId: number;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
