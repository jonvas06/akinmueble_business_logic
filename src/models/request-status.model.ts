import {Entity, model, property, hasMany} from '@loopback/repository';
import {Request} from './request.model';

@model()
export class RequestStatus extends Entity {
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
  statusName: string;

  @hasMany(() => Request)
  requests: Request[];

  constructor(data?: Partial<RequestStatus>) {
    super(data);
  }
}

export interface RequestStatusRelations {
  // describe navigational properties here
}

export type RequestStatusWithRelations = RequestStatus & RequestStatusRelations;
