import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {PropertyManager, PropertyManagerRelations, Property} from '../models';
import {PropertyRepository} from './property.repository';

export class PropertyManagerRepository extends DefaultCrudRepository<
  PropertyManager,
  typeof PropertyManager.prototype.id,
  PropertyManagerRelations
> {

  public readonly properties: HasManyRepositoryFactory<Property, typeof PropertyManager.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(PropertyManager, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
  }
}
