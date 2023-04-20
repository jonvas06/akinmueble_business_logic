/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */

import {service} from '@loopback/core';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {FormContact} from '../models';
import {WebSiteService} from '../services';


export class WebSiteController {
  constructor(
    @service(WebSiteService)
    private WebSiteService: WebSiteService

  ) {}

  @post('/send-message-form-contact')
  @response(200 , {
    description: 'Enviar mensaje del forumulario de contacto',
    content: {'application/json': {schema: getModelSchemaRef(FormContact)}},
  })
  async SendContactForm(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormContact),
        },
      },
    })
    data: FormContact,
  ): Promise<boolean | undefined> {
    const send = this.WebSiteService.sendForm(data);
    try {
      if (!send) {
        throw new HttpErrors[400]("El formulario no se pudo enviar");
      }else{
        return await send;
      }
    }catch{
      throw new HttpErrors[500]("Error del servidor para enviar el mensaje");
    }
  }
}



