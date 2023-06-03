import {Model, model, property} from '@loopback/repository';
import {Customer} from './customer.model';

@model()
export class CustomerRequestReport extends Model {
  @property({
    type: 'Customer',
    required: true,
  })
  customer: Customer;

  @property({
    type: 'number',
    required: true,
  })
  requestsQuantity: number;

  constructor(data?: Partial<CustomerRequestReport>) {
    super(data);
  }
}

export interface CustomerRequestReposrtRelations {
  // describe navigational properties here
}

export type CustomerRequestReposrtWithRelations = CustomerRequestReport &
  CustomerRequestReposrtRelations;
