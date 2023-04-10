import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Property} from './property.model';

@model({
  settings: {
    foreignKeys: {
      fk_property_propertyId: {
        name: 'fk_propertyPicture_propertyId',
        entity: 'Property',
        entityKey: 'id',
        foreignKey: 'propertyId',
      },
    },
  },
})
export class PropertyPicture extends Entity {
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
  pictureSource: string;

  @belongsTo(() => Property)
  propertyId: number;

  constructor(data?: Partial<PropertyPicture>) {
    super(data);
  }
}

export interface PropertyPictureRelations {
  // describe navigational properties here
}

export type PropertyPictureWithRelations = PropertyPicture &
  PropertyPictureRelations;
