import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PropertyStatus, PropertyStatusRelations, Property} from '../models';
import {PropertyRepository} from './property.repository';

export class PropertyStatusRepository extends DefaultCrudRepository<
  PropertyStatus,
  typeof PropertyStatus.prototype.id,
  PropertyStatusRelations
> {

  public readonly properties: HasManyRepositoryFactory<Property, typeof PropertyStatus.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(PropertyStatus, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
  }
}
