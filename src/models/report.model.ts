import {Entity, model, property} from '@loopback/repository';

@model()
export class Report extends Entity {
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
  commentary: string;

  @property({
    type: 'string',
    required: true,
  })
  requestId: string;


  constructor(data?: Partial<Report>) {
    super(data);
  }
}

export interface ReportRelations {
  // describe navigational properties here
}

export type ReportWithRelations = Report & ReportRelations;
