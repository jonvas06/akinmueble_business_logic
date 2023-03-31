import {Entity, model, property} from '@loopback/repository';

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
  dataoccupied?: string;

  @property({
    type: 'string',
    required: true,
  })
  videoSource: string;

  @property({
    type: 'string',
    required: true,
  })
  advisorId: string;

  @property({
    type: 'string',
    required: true,
  })
  statusId: string;

  @property({
    type: 'string',
    required: true,
  })
  cidyId: string;

  @property({
    type: 'string',
    required: true,
  })
  offerId: string;

  @property({
    type: 'string',
    required: true,
  })
  propertyTypeId: string;

  @property({
    type: 'string',
    required: true,
  })
  porpertyManagerId: string;


  constructor(data?: Partial<Property>) {
    super(data);
  }
}

export interface PropertyRelations {
  // describe navigational properties here
}

export type PropertyWithRelations = Property & PropertyRelations;
