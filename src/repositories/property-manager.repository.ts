import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PropertyManager, PropertyManagerRelations} from '../models';

export class PropertyManagerRepository extends DefaultCrudRepository<
  PropertyManager,
  typeof PropertyManager.prototype.id,
  PropertyManagerRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(PropertyManager, dataSource);
  }
}
