import {Entity, model, property, hasMany} from '@loopback/repository';
import {Request} from './request.model';

@model()
export class RequestType extends Entity {
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
  requestTypeName: string;

  @hasMany(() => Request)
  requests: Request[];

  constructor(data?: Partial<RequestType>) {
    super(data);
  }
}

export interface RequestTypeRelations {
  // describe navigational properties here
}

export type RequestTypeWithRelations = RequestType & RequestTypeRelations;
