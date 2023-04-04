/* eslint-disable @typescript-eslint/naming-convention */
import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Advisor} from './advisor.model';
import {City} from './city.model';
import {OfferType} from './offer-type.model';
import {PropertyManager} from './property-manager.model';
import {PropertyPicture} from './property-picture.model';
import {PropertyStatus} from './property-status.model';
import {PropertyType} from './property-type.model';
import {Request} from './request.model';


@model()
export class Property extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'date',
  })
  dataOccupied?: string;

  @property({
    type: 'string',
    required: false,
  })
  videoSource: string;

  @belongsTo(() => Advisor)
  advisorId: number;

  @belongsTo(() => PropertyStatus)
  propertyStatusId: number;

  @belongsTo(() => City)
  cityId: number;

  @belongsTo(() => OfferType)
  offerTypeId: number;

  @belongsTo(() => PropertyManager)
  propertyManagerId: number;

  @belongsTo(() => PropertyType)
  propertyTypeId: number;

  @hasMany(() => PropertyPicture)
  propertyPictures: PropertyPicture[];

  @hasMany(() => Request)
  requests: Request[];

  constructor(data?: Partial<Property>) {
    super(data);
  }
}

export interface PropertyRelations {
  // describe navigational properties here
}

export type PropertyWithRelations = Property & PropertyRelations;
