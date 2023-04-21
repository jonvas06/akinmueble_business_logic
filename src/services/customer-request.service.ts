/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {configurationNotification} from '../config/notification.config';
import {Request} from '../models';
import {
  AdvisorRepository,
  CustomerRepository,
  PropertyRepository,
} from '../repositories';
import {NotificationService} from './notification.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerRequestService {
  constructor(
    @repository(AdvisorRepository)
    private advisorRepository: AdvisorRepository,
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @service(NotificationService)
    private notificationService: NotificationService,
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
  ) {}
  public async notifyAdvisor(request: Request): Promise<Request> {
    const property = await this.propertyRepository.findOne({
      where: {id: request.propertyId},
    });
    if (!property) {
      throw HttpErrors[400]('');
    }
    const advisorProperty = await this.advisorRepository.findOne({
      where: {id: property.advisorId},
    });
    if (!advisorProperty) {
      throw HttpErrors[400]('');
    }
    //crear code request
    request.requestStatusId = 1;
    request.creationDate= new Date(Date.now());
    const newRequest = await this.customerRepository
      .requests(advisorProperty.id)
      .create(request);
    const url = configurationNotification.urlNotification2fa;
    let data = {
      destinationEmail: advisorProperty.email,
      destinationName:
        advisorProperty.firstName + ' ' + advisorProperty.secondName
          ? advisorProperty.secondName
          : '' + '' + advisorProperty.firtsLastName,
      contectEmail: `se ha hecho una solicitud a la propiedad con id ${property.id}.`,
      subjectEmail: configurationNotification.subjectCustomerNotification,
    };
    this.notificationService.SendNotification(data, url);
    return newRequest;
  }
}
