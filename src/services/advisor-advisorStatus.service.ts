import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdvisorRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorAdvisorStatusService {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRepository: AdvisorRepository,
  ) {}

  public async changeAdvisorStatus(advisorId: number, statusId: number) {
    await this.advisorRepository.updateById(advisorId, {
      advisorStatusId: statusId,
    });

    if (statusId === 1) {
      // Crear el usuario en ms- seguridad
    }
  }
}
