import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PropertyStatus, PropertyStatusRelations} from '../models';

export class PropertyStatusRepository extends DefaultCrudRepository<
  PropertyStatus,
  typeof PropertyStatus.prototype.id,
  PropertyStatusRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(PropertyStatus, dataSource);
  }
}
