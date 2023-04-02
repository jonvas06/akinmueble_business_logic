import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {OfferType, OfferTypeRelations} from '../models';

export class OfferTypeRepository extends DefaultCrudRepository<
  OfferType,
  typeof OfferType.prototype.id,
  OfferTypeRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(OfferType, dataSource);
  }
}
