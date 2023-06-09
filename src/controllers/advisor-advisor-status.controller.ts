import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, patch, response} from '@loopback/rest';
import {Advisor, AdvisorStatus} from '../models';
import {AdvisorRepository} from '../repositories';
import {AdvisorAdvisorStatusService} from '../services/advisor-advisorStatus.service';

export class AdvisorAdvisorStatusController {
  constructor(
    @repository(AdvisorRepository)
    public advisorRepository: AdvisorRepository,
    @service(AdvisorAdvisorStatusService)
    private advisorAdvisorStatusService: AdvisorAdvisorStatusService,
  ) {}

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

  @patch('/advisor/{advisorId}/advisor_status/{statusId}')
  @response(204, {
    description: 'advisorStatus PATCH success',
  })
  async changeAdvisorStatus(
    @param.path.number('advisorId') advisorId: number,
    @param.path.number('statusId') statusId: number,
  ): Promise<Advisor> {
    try {
      return await this.advisorAdvisorStatusService.changeAdvisorStatus(
        advisorId,
        statusId,
      );
    } catch (error) {
      throw error;
    }
  }
}
