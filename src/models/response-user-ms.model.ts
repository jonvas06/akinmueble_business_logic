import {Model, model, property} from '@loopback/repository';

@model()
export class ResponseUserMs extends Model {
  @property({
    type: 'boolean',
    required: true,
  })
  ok: boolean;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'object',
  })
  data?: object;


  constructor(data?: Partial<ResponseUserMs>) {
    super(data);
  }
}

export interface ResponseUserMsRelations {
  // describe navigational properties here
}

export type ResponseUserMsWithRelations = ResponseUserMs & ResponseUserMsRelations;
