import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {configurationNotification} from '../config/notification.config';
import {Advisor, Property, Request} from '../models';
import {
  AdvisorRepository,
  CustomerRepository,
  PropertyRepository,
  RequestRepository,
} from '../repositories';
import {NotificationService} from './notification.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerRequestService {
  constructor(
    //********repositorys**********
    @repository(AdvisorRepository)
    private advisorRepository: AdvisorRepository,
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
    @repository(RequestRepository)
    private requestRepository: RequestRepository,
    //********service**********
    @service(NotificationService)
    private notificationService: NotificationService,
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
      throw HttpErrors[400]('no se encuentra la propiedad');
    }
    const advisorProperty = await this.advisorRepository.findOne({
      where: {id: property.advisorId},
    });
    if (!advisorProperty) {
      throw HttpErrors[400]('no se encontro el asesor');
    }
    request.requestStatusId = 1; //estado 1= estado enviado
    request.creationDate = new Date(Date.now());
    let repetRequest = await this.requestRepository.find({
      where: {
        customerId: request.customerId,
        propertyId: request.propertyId,
      },
    });
    //se revisa que si haya llegado un array, y se recorre request por request para verificar que no tenga multiples solicitudes enviadas
    if (repetRequest) {
      repetRequest.forEach(element => {
        if (!element.closeDate) {
          throw HttpErrors[400](
            'un cliente no puede hacer mas de una solicitud a una misma propiedad, cuando ya cuenta con una activa',
          );
        }
        if (!request.creationDate) {
          throw HttpErrors[400]('se ha generado un error al crear la fecha');
        }
        if (element.closeDate.getDate > request.creationDate.getDate) {
          throw HttpErrors[400](
            'un cliente no puede hacer mas de una solicitud a una misma propiedad, cuando ya cuenta con una activa',
          );
        }
      });
    }
    const newRequest = await this.customerRepository
      .requests(request.customerId)
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
