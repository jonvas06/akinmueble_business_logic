import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {configurationNotification} from '../config/notification.config';
import {Advisor, Property, Request} from '../models';
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
  /**
   * recibe la informacion de la request que se desea crear, en un shcema de request
   * @param request
   * @returns Request
   */
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
    request.creationDate = new Date(Date.now());
    const newRequest = await this.customerRepository
      .requests(advisorProperty.id)
      .create(request);
    this.notifyAdvisorEmail(advisorProperty, property);
    return newRequest;
  }
  /**
   *recibe el advisor y la proppiedad para notificar al advisor de esa propiedad
   * e indicarle el id de la propiedad que recibio la request
   * @param advisorProperty
   * @param property
   */
  private notifyAdvisorEmail(advisorProperty: Advisor, property: Property) {
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
  }
}
