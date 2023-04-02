import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<RequestType>) {
    super(data);
  }
}

export interface RequestTypeRelations {
  // describe navigational properties here
}

export type RequestTypeWithRelations = RequestType & RequestTypeRelations;
