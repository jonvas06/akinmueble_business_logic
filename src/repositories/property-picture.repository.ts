import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PropertyPicture, PropertyPictureRelations, Property} from '../models';
import {PropertyRepository} from './property.repository';

export class PropertyPictureRepository extends DefaultCrudRepository<
  PropertyPicture,
  typeof PropertyPicture.prototype.id,
  PropertyPictureRelations
> {

  public readonly property: BelongsToAccessor<Property, typeof PropertyPicture.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(PropertyPicture, dataSource);
    this.property = this.createBelongsToAccessorFor('property', propertyRepositoryGetter,);
    this.registerInclusionResolver('property', this.property.inclusionResolver);
  }
}
