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
import {Report, Request} from '../models';
import {RequestRepository} from '../repositories';

export class RequestReportController {
  constructor(
    @repository(RequestRepository)
    protected requestRepository: RequestRepository,
  ) {}

  @get('/requests/{id}/reports', {
    responses: {
      '200': {
        description: 'Array of Request has many Report',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Report)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Report>,
  ): Promise<Report[]> {
    try {
      return this.requestRepository.reports(id).find(filter);
    } catch (error) {
      throw error;
    }
  }

  @post('/requests/{id}/reports', {
    responses: {
      '200': {
        description: 'Request model instance',
        content: {'application/json': {schema: getModelSchemaRef(Report)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Request.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Report, {
            title: 'NewReportInRequest',
            exclude: ['id'],
            optional: ['requestId'],
          }),
        },
      },
    })
    report: Omit<Report, 'id'>,
  ): Promise<Report> {
    return this.requestRepository.reports(id).create(report);
  }

  @patch('/requests/{id}/reports', {
    responses: {
      '200': {
        description: 'Request.Report PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Report, {partial: true}),
        },
      },
    })
    report: Partial<Report>,
    @param.query.object('where', getWhereSchemaFor(Report))
    where?: Where<Report>,
  ): Promise<Count> {
    return this.requestRepository.reports(id).patch(report, where);
  }

  @del('/requests/{id}/reports', {
    responses: {
      '200': {
        description: 'Request.Report DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Report))
    where?: Where<Report>,
  ): Promise<Count> {
    return this.requestRepository.reports(id).delete(where);
  }
}
