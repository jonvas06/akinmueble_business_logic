import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Advisor, AdvisorRelations} from '../models';

export class AdvisorRepository extends DefaultCrudRepository<
  Advisor,
  typeof Advisor.prototype.id,
  AdvisorRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Advisor, dataSource);
  }
}
