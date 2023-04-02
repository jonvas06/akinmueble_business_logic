import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {OfferType, OfferTypeRelations, Property} from '../models';
import {PropertyRepository} from './property.repository';

export class OfferTypeRepository extends DefaultCrudRepository<
  OfferType,
  typeof OfferType.prototype.id,
  OfferTypeRelations
> {

  public readonly properties: HasManyRepositoryFactory<Property, typeof OfferType.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(OfferType, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
  }
}
