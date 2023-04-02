import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {RequestType, RequestTypeRelations} from '../models';

export class RequestTypeRepository extends DefaultCrudRepository<
  RequestType,
  typeof RequestType.prototype.id,
  RequestTypeRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(RequestType, dataSource);
  }
}
