import {Model, model, property} from '@loopback/repository';

@model()
export class FormContact extends Model {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
    required: true,
  })
  typeMessage: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phone?: string;


  constructor(data?: Partial<FormContact>) {
    super(data);
  }
}

export interface FormContactRelations {
  // describe navigational properties here
}

export type FormContactWithRelations = FormContact & FormContactRelations;
