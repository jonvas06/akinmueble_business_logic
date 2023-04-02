import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Report,
  Request,
} from '../models';
import {ReportRepository} from '../repositories';

export class ReportRequestController {
  constructor(
    @repository(ReportRepository)
    public reportRepository: ReportRepository,
  ) { }

  @get('/reports/{id}/request', {
    responses: {
      '200': {
        description: 'Request belonging to Report',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Request)},
          },
        },
      },
    },
  })
  async getRequest(
    @param.path.number('id') id: typeof Report.prototype.id,
  ): Promise<Request> {
    return this.reportRepository.request(id);
  }
}
