import {Entity, model, property} from '@loopback/repository';

@model()
export class PropertyStatus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  nameStatus: string;


  constructor(data?: Partial<PropertyStatus>) {
    super(data);
  }
}

export interface PropertyStatusRelations {
  // describe navigational properties here
}

export type PropertyStatusWithRelations = PropertyStatus & PropertyStatusRelations;
