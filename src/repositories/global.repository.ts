import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Global, GlobalRelations} from '../models';

export class GlobalRepository extends DefaultCrudRepository<
  Global,
  typeof Global.prototype.id,
  GlobalRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Global, dataSource);
  }
}
