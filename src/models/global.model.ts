import {Entity, model, property} from '@loopback/repository';

@model()
export class Global extends Entity {
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
  emailContact: string;

  @property({
    type: 'string',
    required: true,
  })
  nameCompany: string;


  constructor(data?: Partial<Global>) {
    super(data);
  }
}

export interface GlobalRelations {
  // describe navigational properties here
}

export type GlobalWithRelations = Global & GlobalRelations;
