import {Entity, model, property, hasMany} from '@loopback/repository';
import {Advisor} from './advisor.model';

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

  @hasMany(() => Advisor)
  advisors: Advisor[];

  constructor(data?: Partial<AdvisorStatus>) {
    super(data);
  }
}

export interface AdvisorStatusRelations {
  // describe navigational properties here
}

export type AdvisorStatusWithRelations = AdvisorStatus & AdvisorStatusRelations;
