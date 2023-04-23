import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Request as RequestModel} from '../models';
import {CustomerRepository, RequestRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class CustomerRequestService {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
    @repository(RequestRepository)
    protected requestRepository: RequestRepository,
  ) {}

  public async getRequestsByCustomer(
    customerId: number,
  ): Promise<RequestModel[]> {
    const requests = await this.customerRepository.requests(customerId).find({
      fields: [
        'id',
        'creationDate',
        'closeDate',
        'requestTypeId',
        'requestStatusId',
        'propertyId',
      ],
      include: [
        {
          relation: 'requestType',
          scope: {
            fields: ['id', 'requestTypeName'],
          },
        },
        {
          relation: 'requestStatus',
          scope: {
            fields: ['id', 'statusName'],
          },
        },
        {
          relation: 'property',
          scope: {
            fields: ['id', 'address', 'price', 'propertyTypeId'],
            include: [
              {
                relation: 'propertyType',
                scope: {
                  fields: ['id', 'typeName'],
                  limit: 1,
                },
              },
              {
                relation: 'propertyPictures',
                scope: {
                  //TODO:
                  //       /*Encontrar la manera de traer solo algunos campos de la relación.
                  //        *No se ha logrado que funcione en una relación de tipo hasMany, en la
                  //        *relación belongsTo con si funciona haciendo un fields:['columna1','columna2'],
                  //        *Pero en relaciones hasMany como esta(Property → PropertyPictures) no funciona
                  //        */
                  limit: 1,
                },
              },
            ],
          },
        },
      ],
    });

    if (!requests) {
      throw new HttpErrors[400]('No se encontraron solicitudes');
    }

    return requests;
  }

  public async getDetailsRequest(
    customerId: number,
    requestId: number,
  ): Promise<RequestModel> {
    const request = await this.requestRepository.findOne({
      fields: [
        'id',
        'creationDate',
        'closeDate',
        'requestTypeId',
        'requestStatusId',
        'propertyId',
        'advisorId',
      ],
      include: [
        {
          relation: 'requestType',
          scope: {
            fields: ['id', 'requestTypeName'],
          },
        },
        {
          relation: 'requestStatus',
          scope: {
            fields: ['id', 'statusName'],
          },
        },
        {
          relation: 'property',
          scope: {
            fields: [
              'id',
              'address',
              'price',
              'videoSource',
              'propertyTypeId',
              'cityId',
            ],
            include: [
              {
                relation: 'propertyType',
                scope: {
                  fields: ['id', 'typeName'],
                  limit: 1,
                },
              },
              {
                relation: 'propertyPictures',
              },
              {
                relation: 'city',
                scope: {
                  include: [
                    {
                      relation: 'department',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'advisor',
          scope: {
            fields: [
              'id',
              'firstName',
              'secondName',
              'firtsLastName',
              'secondLastName',
              'email',
              'phone',
            ],
          },
        },
        {
          relation: 'reports',
        },
      ],
      where: {id: requestId, customerId: customerId},
    });

    if (!request) {
      throw new HttpErrors[400]('No se encontró la request');
    }

    return request;
  }
}
