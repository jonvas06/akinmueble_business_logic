import {Model, model, property} from '@loopback/repository';

@model()
export class CustomResponse extends Model {
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
  data: object;

  constructor(data?: Partial<CustomResponse>) {
    super(data);
  }
}

export interface CustomResponseRelations {
  // describe navigational properties here
}

export type CustomResponseWithRelations = CustomResponse &
  CustomResponseRelations;
