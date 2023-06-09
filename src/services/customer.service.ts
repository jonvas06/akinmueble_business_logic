import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {
  CustomerRegister,
  CustomerRequestReport,
  ResponseUserMs,
} from '../models';
import {CustomerRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerService {
  constructor(
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
  ) {}

  public async createCustomer(
    customer: CustomerRegister,
  ): Promise<ResponseUserMs> {
    const newCustomer = {
      firstName: customer.firstName,
      secondName: customer.secondName,
      firstLastName: customer.firstLastName,
      secondLastName: customer.secondLastName,
      documentNumber: customer.documentNumber,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
    };

    if (customer.address === undefined) {
      newCustomer.address = 'Sin direccíon';
    }

    const newCreateCustomer = await this.customerRepository.create(newCustomer);
    if (!newCreateCustomer) {
      throw new HttpErrors[400]('No se pudo crear el customer');
    }

    const data = {
      firstName: newCreateCustomer.firstName,
      secondName: newCreateCustomer.secondName,
      firstLastName: newCreateCustomer.firstLastName,
      secondLastName: newCreateCustomer.secondLastName,
      email: newCreateCustomer.email,
      password: customer.password,
      phone: newCreateCustomer.phone,
      pk: newCreateCustomer.id,
      roleId: `${SecurityConfiguration.roleIds.customer}`,
    };

    const url = `${SecurityConfiguration.securityMicroserviceLink}${SecurityConfiguration.createUserEndPoint}`;

    const rest = await fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-type': 'application/json'},
    });

    const json = rest.json();

    return json as ResponseUserMs;
  }

  async reportRequestsByCustomer(
    requestType?: number,
  ): Promise<CustomerRequestReport[]> {
    let reports: CustomerRequestReport[] = [];

    if (!requestType) {
      reports = (await this.customerRepository.execute(`
      SELECT customer.id, customer.firstName, customer.secondName,
      customer.firstLastName, customer.secondLastName,
      customer.documentNumber, customer.email, customer.phone,
      customer.address , count(request.id) as requestsQuantity FROM customer
      INNER JOIN request ON customer.id = request.customerId
      INNER JOIN requestType ON request.requestTypeId = requestType.id
      GROUP BY customer.id
      `)) as CustomerRequestReport[];
    }

    if (requestType) {
      reports = (await this.customerRepository.execute(`
        SELECT customer.id, customer.firstName, customer.secondName,
        customer.firstLastName, customer.secondLastName,
        customer.documentNumber, customer.email, customer.phone,
        customer.address , count(request.id) as requestsQuantity FROM customer
        INNER JOIN request ON customer.id = request.customerId
        INNER JOIN requestType ON request.requestTypeId = requestType.id
        WHERE
        requestType.id = ${requestType}
        GROUP BY customer.id
      `)) as CustomerRequestReport[];
    }

    return reports;
  }
}
