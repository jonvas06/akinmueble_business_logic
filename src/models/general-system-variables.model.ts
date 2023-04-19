import {Entity, model, property} from '@loopback/repository';

@model()
export class GeneralSystemVariables extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  purchasePercentage?: number;

  @property({
    type: 'string',
    required: true,
  })
  nameRealEstate: string;

  @property({
    type: 'string',
    required: true,
  })
  emailContactAdmin: string;

  @property({
    type: 'string',
    required: true,
  })
  nameContactAdmin: string;


  constructor(data?: Partial<GeneralSystemVariables>) {
    super(data);
  }
}

export interface GeneralSystemVariablesRelations {
  // describe navigational properties here
}

export type GeneralSystemVariablesWithRelations = GeneralSystemVariables & GeneralSystemVariablesRelations;
