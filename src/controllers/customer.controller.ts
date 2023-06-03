import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {Customer, CustomerRegister, ResponseUserMs} from '../models';
import {CustomResponse} from '../models/custom-reponse.model';
import {CustomerRepository} from '../repositories';
import {CustomerService} from '../services';

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @service(CustomerService)
    private customerService: CustomerService,
  ) {}

  @post('/customers')
  @response(200, {
    description: 'Customer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id'>,
  ): Promise<Customer> {
    return this.customerRepository.create(customer);
  }

  @post('/customers-register')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(CustomerRegister)},
    },
  })
  async createR(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerRegister),
        },
      },
    })
    customer: CustomerRegister,
  ): Promise<ResponseUserMs> {
    try {
      return await this.customerService.createCustomer(customer);
    } catch (error) {
      console.log(error);
      throw new HttpErrors[400]('No se pudo crear el customer');
    }
  }

  @get('/customers/count')
  @response(200, {
    description: 'Customer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Customer) where?: Where<Customer>): Promise<Count> {
    return this.customerRepository.count(where);
  }

  /**
   * Filtrar clientest que han hecho solicitudes tanto por compra como por alquiler.
   * Filtrar clientes que han hecho solicitudes por alquiler.
   * Filtrar clientes que han hecho solicitudes por compra
   */
  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.listAction,
    ],
  })
  @get('/customers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CustomResponse),
        },
      },
    },
  })
  async reportRequestsByCustomer(
    @param.query.number('requestType') requestType?: number,
  ): Promise<CustomResponse> {
    try {
      const response = new CustomResponse();
      const data = await this.customerService.reportRequestsByCustomer(
        requestType,
      );

      response.message = '';
      response.data = data;
      return response;
    } catch (error) {
      console.log(error);
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
  @get('/allCustomers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }

  @patch('/customers')
  @response(200, {
    description: 'Customer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.updateAll(customer, where);
  }

  @get('/customers/{id}')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Customer, {exclude: 'where'})
    filter?: FilterExcludingWhere<Customer>,
  ): Promise<Customer> {
    return this.customerRepository.findById(id, filter);
  }

  @patch('/customers/{id}')
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    await this.customerRepository.updateById(id, customer);
  }

  @put('/customers/{id}')
  @response(204, {
    description: 'Customer PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customer: Customer,
  ): Promise<void> {
    await this.customerRepository.replaceById(id, customer);
  }

  @del('/customers/{id}')
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.customerRepository.deleteById(id);
  }
}
