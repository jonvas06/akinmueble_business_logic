import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Request} from './request.model';

@model()
export class Report extends Entity {
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
  commentary: string;

  @belongsTo(() => Request)
  requestId: number;

  constructor(data?: Partial<Report>) {
    super(data);
  }
}

export interface ReportRelations {
  // describe navigational properties here
}

export type ReportWithRelations = Report & ReportRelations;
