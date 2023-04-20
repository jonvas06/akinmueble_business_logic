/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {configurationNotification} from '../config/notification.config';
import {GeneralSystemVariables} from '../models';
import {GeneralSystemVariablesRepository} from '../repositories';
import {NotificationService} from './notification.service';

@injectable({scope: BindingScope.TRANSIENT})
export class WebSiteService {
  constructor(
    @repository(GeneralSystemVariablesRepository)
    private VariablesRepository: GeneralSystemVariablesRepository,
    @service(NotificationService)
    private SendNotification: NotificationService
  ) {}

  /*
   * Add service methods here
   */
  public async sendForm(data: any): Promise<any> {
    const variables: GeneralSystemVariables[] =await this.VariablesRepository.find();
      if ((variables).length === 0){
        throw new HttpErrors[500]("No hay variables del sistema para realizar el proceso");
      }
      const emailContactAdmin = variables[0].emailContactAdmin;
      const nameContactAdmin = variables[0].nameContactAdmin;
      const subjectEmail = "Contacto desde sitio web";
      const message = `Estimado ${nameContactAdmin}, se ha enviado un mensaje desde el sitio web con la siguiente informacíon:

      Nombre: ${data.name}
      Correo: ${data.email}
      Celular: ${data.phone}
      Tipo de Mensaje: ${data.typeMessage}

      Texto del mensaje: ${data.message}

      `;
      const datacontact = {
        destinationEmail : emailContactAdmin,
        destinationName : nameContactAdmin,
        subjectEmail : subjectEmail,
        contectEmail : message
      };
      const send = this.SendNotification.SendNotification(datacontact, configurationNotification.urlNotification2fa)
      return send
  }
}
