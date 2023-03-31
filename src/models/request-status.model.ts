import {Entity, model, property} from '@loopback/repository';

@model()
export class RequestStatus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  statusName: string;


  constructor(data?: Partial<RequestStatus>) {
    super(data);
  }
}

export interface RequestStatusRelations {
  // describe navigational properties here
}

export type RequestStatusWithRelations = RequestStatus & RequestStatusRelations;
