import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SecurityConfiguration} from '../config/security.config';
import {Advisor, ResponseUserMs} from '../models';
import {AdvisorRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorAdvisorStatusService {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRepository: AdvisorRepository,
  ) {}

  public async changeAdvisorStatus(
    advisorId: number,
    statusId: number,
  ): Promise<Advisor> {
    const advisor = await this.advisorRepository.findById(advisorId);
    if (!advisor) {
      throw new HttpErrors[400]('No se encontró el asesor');
    }

    if (statusId !== 1 && statusId !== 2 && statusId !== 3) {
      throw new HttpErrors[400](
        'El estado que esta intentando enviar no es válido',
      );
    }

    if (advisor.advisorStatusId == statusId) {
      throw new HttpErrors[400](
        'El asesor ya tiene el estado que estas queriendo actualizar',
      );
    }

    if (statusId === 1) {
      const userIsCreated = await this.createAdvisorUser(advisor);
      if (!userIsCreated || (userIsCreated && !userIsCreated.ok)) {
        throw new HttpErrors[400](
          'No fue posible crear el usuario para el asesor',
        );
      }
    }

    await this.advisorRepository.updateById(advisorId, {
      advisorStatusId: statusId,
    });

    if (statusId === 2) {
      //TODO: logic to status → pendiente
    }
    if (statusId === 3) {
      //TODO: logic to status → rechazado
    }

    return await this.advisorRepository.findById(advisorId);
  }

  public async createAdvisorUser(advisor: Advisor): Promise<ResponseUserMs> {
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

    return json as ResponseUserMs;
  }
}
