import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PropertyPicture, PropertyPictureRelations} from '../models';

export class PropertyPictureRepository extends DefaultCrudRepository<
  PropertyPicture,
  typeof PropertyPicture.prototype.id,
  PropertyPictureRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(PropertyPicture, dataSource);
  }
}
