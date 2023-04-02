import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {AdvisorStatus, AdvisorStatusRelations} from '../models';

export class AdvisorStatusRepository extends DefaultCrudRepository<
  AdvisorStatus,
  typeof AdvisorStatus.prototype.id,
  AdvisorStatusRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(AdvisorStatus, dataSource);
  }
}
