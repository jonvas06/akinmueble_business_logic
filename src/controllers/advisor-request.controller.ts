import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors, get, getModelSchemaRef, param, patch} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {Request} from '../models';
import {AdvisorRepository} from '../repositories';
import {AdvisorRequestService} from '../services/advisor-request.service';

export class AdvisorRequestController {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRepository: AdvisorRepository,
    @service(AdvisorRequestService)
    private advisorRequestService: AdvisorRequestService,
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
    return this.advisorRepository.requests(id).find(filter);
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
          content: {'application/json': {schema: getModelSchemaRef(Request)}},
        },
      },
    },
  )
  async patch(
    @param.path.number('advisorId') advisorId: number,
    @param.path.number('requestId') requestId: number,
    @param.path.number('statusId') statusId: number,
  ): Promise<Request> {
    try {
      const request = await this.advisorRequestService.changeRequestSatus(
        advisorId,
        requestId,
        statusId,
      );
      if (!request) {
        throw new HttpErrors[400]('No se ha hecho la actualización');
      }
      return request;
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
