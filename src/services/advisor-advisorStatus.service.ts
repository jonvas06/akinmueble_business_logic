import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {Advisor} from '../models';
import {AdvisorRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorAdvisorStatusService {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRepository: AdvisorRepository,
  ) {}

  public async changeAdvisorStatus(advisorId: number, statusId: number) {
    const advisor = await this.advisorRepository.findById(advisorId);
    if (!advisor) {
      throw new HttpErrors[400]('No se encontró el asesor');
    }
    await this.advisorRepository.updateById(advisorId, {
      advisorStatusId: statusId,
    });

    if (statusId === 1) {
      this.createAdvisorUser(advisor);
    }
  }

  public async createAdvisorUser(advisor: Advisor) {
    const user = {
      firstName: advisor.firstName,
      secondName: advisor.secondName,
      firstLastName: advisor.firtsLastName,
      secondLastName: advisor.secondLastName,
      email: advisor.email,
      phone: advisor.phone,
      pk: advisor.id,
      roleId: SecurityConfiguration.roleIds.advisor,
    };

    const response = await fetch('http://localhost:3000/user', {
      method: 'post',
      body: JSON.stringify(user),
      headers: {'Content-type': 'application/json'},
    });

    const json = await response.json();
    console.log(json);
  }
}
