import {BindingScope, injectable} from '@loopback/context';
import {service} from '@loopback/core';
import {Where, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Request, Response} from 'express-serve-static-core';
import path from 'path';
import {generalConfiguration} from '../config/general.config';
import {configurationNotification} from '../config/notification.config';
import {Customer, Report, Request as RequestModel} from '../models';
import {
  CustomerRepository,
  PropertyRepository,
  RequestRepository,
  RequestStatusRepository,
} from '../repositories';
import {FileManagerService} from './fileManager.service';
import {NotificationService} from './notification.service';

@injectable({scope: BindingScope.TRANSIENT})
export class AdvisorRequestService {
  constructor(
    @repository(RequestRepository)
    private requestRepository: RequestRepository,
    @repository(RequestStatusRepository)
    private requestStatusRepository: RequestStatusRepository,
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @service(NotificationService)
    private notificationService: NotificationService,
    @service(FileManagerService)
    protected fileManagerServcie: FileManagerService,
    @repository(PropertyRepository)
    private propertyRepository: PropertyRepository,
  ) {}

  public async changeRequestSatus(
    advisorId: number,
    requestId: number,
    newStatusId: number,
    report: Report | undefined,
  ): Promise<RequestModel | null> {
    const oldRequest = await this.requestRepository.findOne({
      where: {id: requestId, advisorId: advisorId},
    });

    if (!oldRequest) {
      throw new HttpErrors[400]('No se encontró la solicitud');
    }

    if (newStatusId == oldRequest.requestStatusId) {
      return null;
    }

    const newStatus = await this.requestStatusRepository.findById(newStatusId);

    if (!newStatus) {
      throw new HttpErrors[400]('No se encontró el estado');
    }

    if (oldRequest.requestStatusId == 1 && newStatusId != 2) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (
      oldRequest.requestStatusId == 2 &&
      newStatusId != 3 &&
      newStatusId != 7 &&
      newStatusId != 8 &&
      newStatusId != 12
    ) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (
      oldRequest.requestStatusId == 3 &&
      newStatusId != 12 &&
      newStatusId != 7 &&
      newStatusId != 8
    ) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (oldRequest.requestStatusId == 4 && newStatusId != 11) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (
      oldRequest.requestStatusId == 5 &&
      newStatusId != 10 &&
      newStatusId != 11
    ) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (oldRequest.requestStatusId == 6) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de una solicitud cancelada por un cliente`,
      );
    }

    if (
      oldRequest.requestStatusId == 7 &&
      newStatusId != 4 &&
      newStatusId != 5 &&
      newStatusId != 8 &&
      newStatusId != 9
    ) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (oldRequest.requestStatusId == 8) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de una solicitud que ha sido abortada por un cliente`,
      );
    }

    if (oldRequest.requestStatusId == 9) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de una solicitud que ha sido abortada por un cliente`,
      );
    }

    if (oldRequest.requestStatusId == 10) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de una solicitud que ha sido incumplimiento de contrato por parte de Akin`,
      );
    }

    if (oldRequest.requestStatusId == 11) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de una solicitud que ha sido incumplimiento de contrato por parte del cliente solicitante`,
      );
    }

    if (
      oldRequest.requestStatusId == 12 &&
      newStatusId != 2 &&
      newStatusId != 3
    ) {
      throw new HttpErrors[400](
        `No puede cambiar el estado de la solicitud a ${newStatus.statusName}`,
      );
    }

    if (newStatusId == 3 && oldRequest.codeptorDocumentsSource == null) {
      throw new HttpErrors[400](
        `No puede cambiar el estado a estudio con codeudor si no existe un formato para los documentos de codeudor cargado`,
      );
    }

    if (newStatusId == 7 && oldRequest.contractSource == null) {
      throw new HttpErrors[400](
        `No puede cambiar el estado a pendiente por contrato si no existe un contrato cargado`,
      );
    }

    const customer = await this.customerRepository.findById(
      oldRequest.customerId,
    );

    if (!customer) {
      throw new HttpErrors[400](
        'Hubo un error al encontrara el cliente que hizo la solicitud',
      );
    }

    const oldStatus = await this.requestStatusRepository.findById(
      oldRequest.requestStatusId,
    );

    if (!oldStatus) {
      throw new HttpErrors[400](
        'Hubo un error al intentar actualizar el estado',
      );
    }

    ////////////////////////////////////////
    let contentEmail = '';

    if (
      newStatusId == 2 ||
      newStatusId == 3 ||
      newStatusId == 4 ||
      newStatusId == 5 ||
      newStatusId == 7 ||
      newStatusId == 12
    ) {
      contentEmail = `<bold>El estado de su solicitud a cambiado de ${oldStatus.statusName} a ${newStatus.statusName}</bold>`;

      if (newStatusId == 2) {
        contentEmail = `${contentEmail} Su solicitud se encuentra desde este momento en estudio, estaremos en contacto con usted.`;
      }
      if (newStatusId == 3) {
        contentEmail = `${contentEmail} Su solicitud se ha estudiado y se ha determinado que requiere un codeudor,
        el asesor se contactará con usted en un plazo máximo de tres días hábiles para darle las indicaciones.`;
      }

      const property = await this.propertyRepository.findById(
        oldRequest.propertyId,
        {include: [{relation: 'requests'}]},
      );

      if (newStatusId == 4) {
        if (!report || (report && report.commentary == '')) {
          throw new HttpErrors[400](
            'Es necesario que hagas un comentario acerca del cambio del estado de la solicitud para que el cliente pueda revisarlo en los reportes',
          );
        }
        contentEmail = `${contentEmail} Felicitaciones, su solicitud ha sido aceptada. Puede revisar los comentarios en la solicitud hechos por el asesor dirigiendose al sistema.`;
        const filter: Where<RequestModel> = {id: {neq: oldRequest.id}};
        await this.changeAllRequestsStatesThroughOneProperty(
          12,
          property.id!,
          filter,
        );

        this.requestRepository.reports(oldRequest.id).create(report);

        const propertyRequests = property.requests;
        const customers = await this.getRejectedCustomers(
          propertyRequests,
          oldRequest.id!,
        );

        let rejectEmailContent =
          'Su solicitud ha sido rechazada debido a que ya fue aceptada otra solicitud para el mismo inmueble';
        this.notifyManyCustomers(customers, rejectEmailContent);
      }

      if (newStatusId == 5) {
        if (!report || (report && report.commentary == '')) {
          throw new HttpErrors[400](
            'Es necesario que hagas un comentario acerca del cambio del estado de la solicitud para que el cliente pueda revisarlo en los reportes',
          );
        }
        contentEmail = `${contentEmail} Felicitaciones, su solicitud ha sido aceptada. Puede revisar los comentarios en la solicitud hechos por el asesor dirigiendose al sistema.`;
        const filter: Where<RequestModel> = {id: {neq: oldRequest.id}};
        this.changeAllRequestsStatesThroughOneProperty(
          12,
          property.id!,
          filter,
        );

        this.requestRepository.reports(oldRequest.id).create(report);

        const propertyRequests = property.requests;
        const customers = await this.getRejectedCustomers(
          propertyRequests,
          oldRequest.id!,
        );

        let rejectEmailContent =
          'Su solicitud ha sido rechazada debido a que ya fue aceptada otra solicitud para el mismo inmueble';
        this.notifyManyCustomers(customers, rejectEmailContent);
      }

      if (newStatusId == 7) {
        contentEmail = `${contentEmail} Hemos subido el contrato,
        por favor ingrese a akinmueble.com, inicie sesión, descargue el contrato
        y diligencielo correctamente para finalizar el proceso. Cualquier duda contacte con su asesor`;
      }

      if (newStatusId == 12) {
        if (!report || (report && report.commentary == '')) {
          throw new HttpErrors[400](
            'Es necesario que hagas un comentario acerca del cambio del estado de la solicitud para que el cliente pueda revisarlo en los reportes',
          );
        }
        contentEmail = `${contentEmail} Su solicitud ha sido rechazada\n
        Comentarios del asesor: ${report.commentary}`;

        this.requestRepository.reports(oldRequest.id).create(report);
      }
    }

    if (newStatusId == 8 || newStatusId == 9) {
      if (!report || (report && report.commentary == '')) {
        throw new HttpErrors[400](
          'Es necesario que hagas un comentario acerca del cambio del estado de la solicitud para que el cliente pueda revisarlo en los reportes',
        );
      }

      if (newStatusId == 8) {
        contentEmail = `${contentEmail} Su solicitud ha sido abortada ya que usted se lo ha solicitado al asesor.\n
        Comentarios del asesor: ${report.commentary}`;
      } else if (newStatusId == 9) {
        contentEmail = `${contentEmail} Su solicitud ha sido rechazada\n
        Comentarios del asesor: ${report.commentary}`;
      }

      this.requestRepository.reports(oldRequest.id).create(report);
    }

    oldRequest.requestStatusId = newStatusId;

    await this.requestRepository.update(oldRequest);

    await this.notifyOneCustomer(customer, contentEmail);

    return await this.requestRepository.findById(requestId);
  }

  public async uploadContractByAdvisor(
    request: Request,
    response: Response,
    advisorId: number,
    requestId: number,
  ): Promise<object | false> {
    const filePath = path.join(
      __dirname,
      generalConfiguration.requestDocumentsFolder,
    );

    const advisorRequest = await this.requestRepository.findOne({
      where: {id: requestId, advisorId: advisorId},
    });

    if (!advisorRequest) {
      throw new HttpErrors[400]('No se encontró la solicitud.');
    }

    let res = await this.fileManagerServcie.StoreFileToPath(
      filePath,
      generalConfiguration.requestDocumentPath,
      request,
      response,
      generalConfiguration.documentsExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        advisorRequest.contractSource = filename;

        this.requestRepository.update(advisorRequest, {
          where: {advisorId: advisorId},
        });

        return {file: filename};
      }
    }
    return res;
  }
  public async uploadDocumentsCodeptorByAdvisor(
    request: Request,
    response: Response,
    advisorId: number,
    requestId: number,
  ): Promise<object | false> {
    const filePath = path.join(
      __dirname,
      generalConfiguration.requestDocumentsFolder,
    );

    const advisorRequest = await this.requestRepository.findOne({
      where: {id: requestId, advisorId: advisorId},
    });

    if (!advisorRequest) {
      throw new HttpErrors[400]('No se encontró la solicitud.');
    }

    let res = await this.fileManagerServcie.StoreFileToPath(
      filePath,
      generalConfiguration.requestDocumentPath,
      request,
      response,
      generalConfiguration.documentsExtensions,
    );
    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        advisorRequest.codeptorDocumentsSource = filename;

        this.requestRepository.update(advisorRequest, {
          where: {advisorId: advisorId},
        });

        return {file: filename};
      }
    }
    return res;
  }

  private async notifyManyCustomers(customers: Customer[], content: string) {
    const url = configurationNotification.urlNotification2fa;
    customers.forEach(customer => {
      let data = {
        destinationEmail: customer.email,
        destinationName:
          customer.firstName + ' ' + customer.secondName
            ? customer.secondName
            : '' + '' + customer.firstLastName,
        contectEmail: `${content}`,
        subjectEmail: configurationNotification.subjectCustomerNotification,
      };

      this.notificationService.SendNotification(data, url);
    });
  }

  private async notifyOneCustomer(customer: Customer, content: string) {
    let data = {
      destinationEmail: customer.email,
      destinationName:
        customer.firstName + ' ' + customer.secondName
          ? customer.secondName
          : '' + '' + customer.firstLastName,
      contectEmail: `${content}`,
      subjectEmail: configurationNotification.subjectCustomerNotification,
    };

    const url = configurationNotification.urlNotification2fa;
    this.notificationService.SendNotification(data, url);
  }

  public async findRequestByIdAndAdvisorId(
    requestId: number,
    advisorId: number,
  ) {
    const oldRequest = await this.requestRepository.findOne({
      where: {id: requestId, advisorId: advisorId},
    });

    if (!oldRequest) {
      throw new HttpErrors[400]('No se encontró la solicitud');
    }

    return oldRequest;
  }

  private async getRejectedCustomers(
    requests: RequestModel[],
    requestId: number,
  ): Promise<Customer[]> {
    const customers = await Promise.all(
      requests.map(async request => {
        if (request.id !== requestId) {
          let customer = await this.customerRepository.findOne({
            where: {id: request.customerId},
          });
          if (customer) {
            return customer;
          }
        }
      }),
    );

    const notUndefinedCustomers = customers.filter(
      customer => customer !== undefined,
    ) as Customer[];

    return notUndefinedCustomers;
  }

  private async changeAllRequestsStatesThroughOneProperty(
    newRequestStatusId: number,
    propertyId: number,
    filter: Where,
  ) {
    await this.propertyRepository
      .requests(propertyId)
      .patch({requestStatusId: newRequestStatusId}, filter);
  }
}
