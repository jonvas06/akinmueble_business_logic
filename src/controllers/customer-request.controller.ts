/* eslint-disable no-useless-catch */
import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';

import {
  HttpErrors,
  Request,
  Response,
  Response as ResponseRes,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  oas,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';

import {SecurityConfiguration} from '../config/security.config';
import {Customer, Request as RequestModel} from '../models';
import {CustomerRepository} from '../repositories';
import {CustomerRequestService} from '../services/customer-request.service';
import {FileManagerService} from '../services/fileManager.service';

export class CustomerRequestController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @service(CustomerRequestService)
    protected customerRequestService: CustomerRequestService,
    @service(FileManagerService)
    protected fileManagerServcie: FileManagerService,
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
            schema: {type: 'array', items: getModelSchemaRef(RequestModel)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    // @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<RequestModel[]> {
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
  @get('/customers/{id}/requests_with_filter', {
    responses: {
      '200': {
        description: 'Array of Customer has many Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RequestModel)},
          },
        },
      },
    },
  })
  async findWithFilter(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<RequestModel>,
  ): Promise<RequestModel[]> {
    try {
      return await this.customerRepository.requests(id).find(filter);
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
            schema: {type: 'array', items: getModelSchemaRef(RequestModel)},
          },
        },
      },
    },
  })
  async findRequestdetails(
    @param.path.number('customerId') customerId: number,
    @param.path.number('requestId') requestId: number,
    // @param.query.object('filter') filter?: Filter<Request>,
  ): Promise<RequestModel> {
    try {
      return await this.customerRequestService.getDetailsRequest(
        customerId,
        requestId,
      );
    } catch (error) {
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.createAction,
    ],
  })
  @post('/customers/{id}/requests', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RequestModel)},
        },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequestModel, {
            title: 'NewRequestInCustomer',
            exclude: ['id'],
            optional: ['customerId'],
          }),
        },
      },
    })
    request: Omit<RequestModel, 'id'>,
  ): Promise<RequestModel> {
    try {
      return await this.customerRequestService.createRequest(request);
    } catch (error) {
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.uploadAction,
    ],
  })
  @post('/customer/{customerId}/upload-document/{requestId}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'file to upload',
      },
    },
  })
  async uploadDocumentByCustomer(
    @param.path.number('customerId') customerId: number,
    @param.path.number('requestId') requestId: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    try {
      const res = await this.customerRequestService.uploadDocumentByCustomer(
        request,
        response,
        customerId,
        requestId,
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.downloadAction,
    ],
  })
  @get('/customer/{customerId}/download-document/{requestId}')
  @oas.response.file()
  async downloadDocumentByCustomer(
    @param.path.number('customerId') customerId: number,
    @param.path.string('requestId') requestId: number,
    @inject(RestBindings.Http.RESPONSE) response: ResponseRes,
  ) {
    try {
      const folder = this.fileManagerServcie.getFileByType(2);
      const request =
        await this.customerRequestService.findRequestByIdAndCustomerId(
          requestId,
          customerId,
        );

      if (!request) {
        throw new HttpErrors[400]('No se encontró la solicitud');
      }

      if (
        request.requestStatusId !== 3 &&
        request.requestStatusId !== 7 &&
        request.requestStatusId !== 4 &&
        request.requestStatusId !== 5 &&
        request.requestStatusId !== 10 &&
        request.requestStatusId !== 11
      ) {
        throw new HttpErrors[400](
          'No se puede descargar el documento solicitado',
        );
      }

      let fileName: string = '';

      if (request.requestStatusId == 3) {
        if (!request.codeptorDocumentsSource) {
          throw new HttpErrors[400](
            'No se encontró ningún documento para descargar',
          );
        }
        fileName = request.codeptorDocumentsSource;
      } else {
        if (!request.contractSource) {
          throw new HttpErrors[400](
            'No se encontró ningún contrato para descargar',
          );
        }
        fileName = request.contractSource;
      }

      const file = this.fileManagerServcie.validateFileName(folder, fileName);

      response.download(file, fileName);
      return response;
    } catch (e) {
      throw e;
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
          schema: getModelSchemaRef(RequestModel, {partial: true}),
        },
      },
    })
    request: Partial<RequestModel>,
    @param.query.object('where', getWhereSchemaFor(RequestModel))
    where?: Where<RequestModel>,
  ): Promise<Count> {
    return this.customerRepository.requests(id).patch(request, where);
  }

  @patch('/customers/{customerId}/cancel_request/{requestId}', {
    responses: {
      '200': {
        description: 'Cancel request',
        content: {
          'application/json': {schema: getModelSchemaRef(RequestModel)},
        },
      },
    },
  })
  async cancelRequest(
    @param.path.number('customerId') customerId: number,
    @param.path.number('requestId') requestId: number,
  ): Promise<RequestModel> {
    try {
      return await this.customerRequestService.cancelRequest(
        customerId,
        requestId,
      );
    } catch (e) {
      throw e;
    }
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
    @param.query.object('where', getWhereSchemaFor(RequestModel))
    where?: Where<RequestModel>,
  ): Promise<Count> {
    return this.customerRepository.requests(id).delete(where);
  }
}
