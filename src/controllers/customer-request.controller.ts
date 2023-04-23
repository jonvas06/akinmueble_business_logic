import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {Count, CountSchema, repository, Where} from '@loopback/repository';
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
import {SecurityConfiguration} from '../config/security.config';
import {Customer, Request} from '../models';
import {CustomerRepository} from '../repositories';
import {CustomerRequestService} from '../services/customer-request.service';

export class CustomerRequestController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @service(CustomerRequestService)
    protected customerRequestService: CustomerRequestService,
  ) {}

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.listAction,
    ],
  })
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
    // @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<Request[]> {
    try {
      return await this.customerRequestService.getRequestsByCustomer(id);
    } catch (error) {
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.listAction,
    ],
  })
  @get('/customers/{customerId}/requests_details/{requestId}', {
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
  async findRequestdetails(
    @param.path.number('customerId') customerId: number,
    @param.path.number('requestId') requestId: number,
    // @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<Request> {
    try {
      return await this.customerRequestService.getDetailsRequest(
        customerId,
        requestId,
      );
    } catch (error) {
      throw error;
    }
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
    return this.customerRepository.requests(id).create(request);
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
