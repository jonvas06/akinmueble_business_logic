import {Entity, model, property} from '@loopback/repository';

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

  @property({
    type: 'string',
    required: true,
  })
  requestTypeId: string;

  @property({
    type: 'string',
    required: true,
  })
  customerId: string;

  @property({
    type: 'string',
    required: true,
  })
  requestStatusId: string;

  @property({
    type: 'string',
    required: true,
  })
  advisorId: string;

  @property({
    type: 'string',
    required: true,
  })
  propertyId: string;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
