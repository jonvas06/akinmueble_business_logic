import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {CustomerRegister} from '../models';
import {CustomerRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerService {
  constructor(
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
  ) {}


  public async createCustomer(customer: CustomerRegister): Promise<Object> {

    const newCustomer = {
      firstName : customer.firstName,
      secondName: customer.secondName,
      firstLastName : customer.firstLastName,
      secondLastName : customer.secondLastName,
      documentNumber : customer.documentNumber,
      email: customer.email,
      address : customer.address,
      phone: customer.phone,
    }

    if (customer.address === undefined){
      newCustomer.address = "Sin direccíon"
    }

    const newCreateCustomer = await this.customerRepository.create(newCustomer)
    if (!newCreateCustomer) {
      throw new HttpErrors[400]("No se pudo crear el customer");
    }
    console.log("hola3");

    const data = {
      firstName : customer.firstName,
      secondName: customer.secondName,
      firstLastName : customer.firstLastName,
      secondLastName : customer.secondLastName,
      documentNumber : customer.documentNumber,
      email: customer.email,
      password : customer.password,
      phone: customer.phone,
      idrole : `${SecurityConfiguration.rolIds.customer}`
    }
    console.log("hola4");

    const url = `${SecurityConfiguration.securityMicroserviceLink}${SecurityConfiguration.createUserEndPoint}`

    const rest = await fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-type': 'application/json'},
    });
    console.log("hola5");

    const json = rest.json()

    return json;
  }
}

