import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Request,
  Customer,
} from '../models';
import {RequestRepository} from '../repositories';

export class RequestCustomerController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.number('id') id: typeof Request.prototype.id,
  ): Promise<Customer> {
    return this.requestRepository.customer(id);
  }
}
