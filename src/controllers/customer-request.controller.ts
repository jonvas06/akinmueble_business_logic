/* eslint-disable no-useless-catch */
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Customer, Request} from '../models';
import {CustomerRepository} from '../repositories';
import {CustomerRequestService} from '../services/customer-request.service';

export class CustomerRequestController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @service(CustomerRequestService)
    private customerRequestService: CustomerRequestService,
  ) {}

  @get('/customers/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Customer has many Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Request)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.customerRepository.requests(id).find(filter);
  }

  @post('/customers/{id}/requests', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Request)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequestInCustomer',
            exclude: ['id'],
            optional: ['customerId'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    try {
      return await this.customerRequestService.notifyAdvisor(request);
    } catch (error) {
      throw error;
    }
  }

  @patch('/customers/{id}/requests', {
    responses: {
      '200': {
        description: 'Customer.Request PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Partial<Request>,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.customerRepository.requests(id).patch(request, where);
  }

  @del('/customers/{id}/requests', {
    responses: {
      '200': {
        description: 'Customer.Request DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Request))
    where?: Where<Request>,
  ): Promise<Count> {
    return this.customerRepository.requests(id).delete(where);
  }
}
