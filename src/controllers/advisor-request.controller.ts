import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  Response as ResponseRes,
  RestBindings,
  get,
  getModelSchemaRef,
  oas,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Response} from 'express-serve-static-core';
import {SecurityConfiguration} from '../config/security.config';
import {Report, Request as RequestModel} from '../models';
import {AdvisorRepository} from '../repositories';
import {AdvisorRequestService} from '../services/advisor-request.service';
import {FileManagerService} from '../services/fileManager.service';

export class AdvisorRequestController {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRepository: AdvisorRepository,
    @service(AdvisorRequestService)
    private advisorRequestService: AdvisorRequestService,
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
  @get('/advisors/{id}/requests', {
    responses: {
      '200': {
        description: 'Array of Advisor has many Request',
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
    @param.query.object('filter') filter?: Filter<RequestModel>,
  ): Promise<RequestModel[]> {
    return this.advisorRepository.requests(id).find(filter);
  }

  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.downloadAction,
    ],
  })
  @get('/advisors/{advisorId}/download-request-contract/{requestId}')
  @oas.response.file()
  async downloadFileByAdvisor(
    @param.path.number('advisorId') advisorId: number,
    @param.path.string('requestId') requestId: number,
    @inject(RestBindings.Http.RESPONSE) response: ResponseRes,
  ) {
    const folder = this.fileManagerServcie.getFileByType(2);
    const request =
      await this.advisorRequestService.findRequestByIdAndAdvisorId(
        requestId,
        advisorId,
      );
    if (!request.contractSource) {
      throw new HttpErrors[400](
        'No se encontró ningún contrato para descargar',
      );
    }
    const fileName = request.contractSource;
    const file = this.fileManagerServcie.validateFileName(folder, fileName);

    response.download(file, fileName);
    return response;
  }
  @authenticate({
    strategy: 'auth',
    options: [
      SecurityConfiguration.menus.menuRequestId,
      SecurityConfiguration.actions.editAction,
    ],
  })
  @patch(
    '/advisors/{advisorId}/requests/{requestId}/change-status/{statusId}',
    {
      responses: {
        '200': {
          description: 'Update Request status',
          content: {
            'application/json': {schema: getModelSchemaRef(RequestModel)},
          },
        },
      },
    },
  )
  async changeRequestState(
    @param.path.number('advisorId') advisorId: number,
    @param.path.number('requestId') requestId: number,
    @param.path.number('statusId') statusId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Report, {
            title: 'Change request status',
            exclude: ['id'],
          }),
        },
      },
    })
    report?: Report,
  ): Promise<RequestModel> {
    try {
      const request = await this.advisorRequestService.changeRequestSatus(
        advisorId,
        requestId,
        statusId,
        report,
      );
      if (!request) {
        throw new HttpErrors[400]('No se ha hecho la actualización');
      }
      return request;
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
  @post('/advisors/{advisorId}/upload-contract/{requestId}', {
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
  async uploadContractByAdvisor(
    @param.path.number('advisorId') advisorId: number,
    @param.path.number('requestId') requestId: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    try {
      let res = await this.advisorRequestService.uploadContractByAdvisor(
        request,
        response,
        advisorId,
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
      SecurityConfiguration.actions.uploadAction,
    ],
  })
  @post('/advisors/{advisorId}/upload-documents-codeptor/{requestId}', {
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
  async uploadDocumentsCodeptortByAdvisor(
    @param.path.number('advisorId') advisorId: number,
    @param.path.number('requestId') requestId: number,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    try {
      let res =
        await this.advisorRequestService.uploadDocumentsCodeptorByAdvisor(
          request,
          response,
          advisorId,
          requestId,
        );
      return res;
    } catch (error) {
      throw error;
    }
  }

  // @post('/advisors/{id}/requests', {
  //   responses: {
  //     '200': {
  //       description: 'Advisor model instance',
  //       content: {'application/json': {schema: getModelSchemaRef(Request)}},
  //     },
  //   },
  // })
  // async create(
  //   @param.path.number('id') id: typeof Advisor.prototype.id,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Request, {
  //           title: 'NewRequestInAdvisor',
  //           exclude: ['id'],
  //           optional: ['advisorId'],
  //         }),
  //       },
  //     },
  //   })
  //   request: Omit<Request, 'id'>,
  // ): Promise<Request> {
  //   return this.advisorRepository.requests(id).create(request);
  // }

  // @patch('/advisors/{id}/requests', {
  //   responses: {
  //     '200': {
  //       description: 'Advisor.Request PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async patch(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Request, {partial: true}),
  //       },
  //     },
  //   })
  //   request: Partial<Request>,
  //   @param.query.object('where', getWhereSchemaFor(Request))
  //   where?: Where<Request>,
  // ): Promise<Count> {
  //   return this.advisorRepository.requests(id).patch(request, where);
  // }

  // @del('/advisors/{id}/requests', {
  //   responses: {
  //     '200': {
  //       description: 'Advisor.Request DELETE success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async delete(
  //   @param.path.number('id') id: number,
  //   @param.query.object('where', getWhereSchemaFor(Request))
  //   where?: Where<Request>,
  // ): Promise<Count> {
  //   return this.advisorRepository.requests(id).delete(where);
  // }
}
