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

@model({
  settings: {
    foreignKeys: {
      fk_property_advisorId: {
        name: 'fk_property_advisorId',
        entity: 'Advisor',
        entityKey: 'id',
        foreignKey: 'advisorId',
      },
      fk_property_propertyStatusId: {
        name: 'fk_property_propertyStatusId',
        entity: 'PropertyStatus',
        entityKey: 'id',
        foreignKey: 'propertyStatusId',
      },
      fk_property_cityId: {
        name: 'fk_property_cityId',
        entity: 'City',
        entityKey: 'id',
        foreignKey: 'cityId',
      },
      fk_property_offerTypeId: {
        name: 'fk_property_offerTypeId',
        entity: 'OfferType',
        entityKey: 'id',
        foreignKey: 'offerTypeId',
      },
      fk_property_propertyManagerId: {
        name: 'fk_property_propertyManagerId',
        entity: 'PropertyManager',
        entityKey: 'id',
        foreignKey: 'propertyManagerId',
      },
      fk_property_propertyTypeId: {
        name: 'fk_property_propertyTypeId',
        entity: 'PropertyType',
        entityKey: 'id',
        foreignKey: 'propertyTypeId',
      },
    },
  },
})
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
    jsonSchema: {
      format: 'date',
      pattern: '^(\\d{4})-(\\d{2})-(\\d{2})$',
    },
  })
  dataOccupied?: Date;

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
  requests: Request[];
  propertyPictures: PropertyPicture[];
}

export type PropertyWithRelations = Property & PropertyRelations;
