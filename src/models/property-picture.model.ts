import {Entity, model, property} from '@loopback/repository';

@model()
export class PropertyPicture extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

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

export type PropertyPictureWithRelations = PropertyPicture & PropertyPictureRelations;
