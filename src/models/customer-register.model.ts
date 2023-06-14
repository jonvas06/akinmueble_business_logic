import {Model, model, property} from '@loopback/repository';

@model()
export class CustomerRegister extends Model {
  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  secondName?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstLastName: string;

  @property({
    type: 'string',
  })
  secondLastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  documentNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  constructor(data?: Partial<CustomerRegister>) {
    super(data);
  }
}

export interface CustomerRegisterRelations {
  // describe navigational properties here
}

export type CustomerRegisterWithRelations = CustomerRegister & CustomerRegisterRelations;
