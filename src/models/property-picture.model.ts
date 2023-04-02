import {Entity, model, property} from '@loopback/repository';

@model()
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

  @property({
    type: 'string',
    required: true,
  })
  propertyId: string;

  constructor(data?: Partial<PropertyPicture>) {
    super(data);
  }
}

export interface PropertyPictureRelations {
  // describe navigational properties here
}

export type PropertyPictureWithRelations = PropertyPicture &
  PropertyPictureRelations;
