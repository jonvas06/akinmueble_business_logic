import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Advisor,
  AdvisorStatus,
} from '../models';
import {AdvisorRepository} from '../repositories';

export class AdvisorAdvisorStatusController {
  constructor(
    @repository(AdvisorRepository)
    public advisorRepository: AdvisorRepository,
  ) { }

  @get('/advisors/{id}/advisor-status', {
    responses: {
      '200': {
        description: 'AdvisorStatus belonging to Advisor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AdvisorStatus)},
          },
        },
      },
    },
  })
  async getAdvisorStatus(
    @param.path.number('id') id: typeof Advisor.prototype.id,
  ): Promise<AdvisorStatus> {
    return this.advisorRepository.advisorStatus(id);
  }
}
