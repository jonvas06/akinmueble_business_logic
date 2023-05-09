import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {configurationNotification} from '../config/notification.config';
import {Advisor} from '../models';
import {CustomResponse} from '../models/custom-reponse.model';
import {AdvisorRepository} from '../repositories';
import {NotificationService} from './notification.service';

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorService {
  constructor(
    @repository(AdvisorRepository)
    protected advisorRespository: AdvisorRepository,
    @service(NotificationService)
    protected notificationService: NotificationService,
  ) {}

  public async createAdvisor(advisor: Advisor): Promise<CustomResponse> {
    const response: CustomResponse = new CustomResponse();

    advisor.advisorStatusId = 2;

    const newAdvisor = await this.advisorRespository.create(advisor);
    if (!newAdvisor) {
      throw new HttpErrors[400]('No se creo el asesor');
    }

    response.ok = true;
    response.message = 'Asesor creado con éxito';
    response.data = newAdvisor;

    const content = `Desde este momento estás en espera para que tu información sea revisada.
    </br> En los próximos días te notificaremos a este mismo correo si fuiste o no aceptado para
     ser parte de nuestro equipo Akinmueble.`;

    const data = {
      destinationEmail: newAdvisor.email!,
      destinationName:
        newAdvisor.firstName + ' ' + newAdvisor.secondName
          ? newAdvisor.secondName
          : '' + '' + newAdvisor.firtsLastName,
      contectEmail: `${content}`,
      subjectEmail: configurationNotification.subjectCustomerNotification,
    };

    const url = configurationNotification.urlNotification2fa;
    this.notificationService.SendNotification(data, url);

    return response;
  }
}
