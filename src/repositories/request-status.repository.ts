import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {RequestStatus, RequestStatusRelations} from '../models';

export class RequestStatusRepository extends DefaultCrudRepository<
  RequestStatus,
  typeof RequestStatus.prototype.id,
  RequestStatusRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(RequestStatus, dataSource);
  }
}
