/* eslint-disable prefer-const */
import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdvisorRepository, RequestRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {NotificationService} from './notification.service';
import {configurationNotification} from '../config/notification.config';

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerRequestService {
  constructor(
    @repository(RequestRepository)
    private requestRepository: RequestRepository,
    @repository(AdvisorRepository)
    private advisorRepository: AdvisorRepository,
    @service(NotificationService)
    private notificationService: NotificationService,
  ) {}

  public async notifyAdvisor(requestId: number) {
    const propertyRequest = await this.requestRepository.findOne({
      where: {propertyId: requestId},
    });
    if (!propertyRequest) {
      throw HttpErrors[400]('');
    }
    const advisorProperty = await this.advisorRepository.findOne({
      where: {id: propertyRequest.advisorId},
    });
    if (!advisorProperty) {
      throw HttpErrors[400]('');
    }
    const url = configurationNotification.urlNotification2fa;
    let data = {
      destinationEmail: advisorProperty.email,
      destinationName:
        advisorProperty.firstName + ' ' + advisorProperty.secondName
          ? advisorProperty.secondName
          : '' + '' + advisorProperty.firtsLastName,
      contectEmail: `se ha hecho una solicitud a la propiedad con id ${propertyRequest.id}. dicha solicitud es la #${requestId}`,
      subjectEmail: configurationNotification.subjectCustomerNotification,
    };

    this.notificationService.SendNotification(data, url);
  }
}
