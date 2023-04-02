import {Entity, model, property} from '@loopback/repository';

@model()
export class AdvisorStatus extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  nameStatus: string;

  constructor(data?: Partial<AdvisorStatus>) {
    super(data);
  }
}

export interface AdvisorStatusRelations {
  // describe navigational properties here
}

export type AdvisorStatusWithRelations = AdvisorStatus & AdvisorStatusRelations;
