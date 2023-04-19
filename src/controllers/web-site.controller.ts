/* eslint-disable @typescript-eslint/naming-convention */
// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {configurationNotification} from '../config/notification.config';
import {FormContact, GeneralSystemVariables} from '../models';
import {GeneralSystemVariablesRepository} from '../repositories';
import {NotificationService} from '../services/notification.service';

// import {inject} from '@loopback/core';


export class WebSiteController {
  constructor(
    @repository(GeneralSystemVariablesRepository)
    private VariablesRepository: GeneralSystemVariablesRepository,
    @service(NotificationService)
    private SendNotification: NotificationService
  ) {}

  @post('/send-message-form-contact')
  @response(200 , {
    description: 'Enviar mensaje del forumulario de contacto',
    content: {'application/json': {schema: getModelSchemaRef(FormContact)}},
  })
  async ValidateUserPermissions(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormContact),
        },
      },
    })
    data: FormContact,
  ): Promise<boolean | undefined> {
    try {
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

      Cordial despedida,
      Equipo uno :).
      `;
      const datacontact = {
        destinationEmail : emailContactAdmin,
        destinationName : nameContactAdmin,
        subjectEmail : subjectEmail,
        contectEmail : message
      };
      const send = this.SendNotification.SendNotification(datacontact, configurationNotification.urlNotification2fa)
      console.log(send);
      return send;
    }catch{
      throw new HttpErrors[500]("Error del servidor para enviar el mensaje");
    }
  }
}
