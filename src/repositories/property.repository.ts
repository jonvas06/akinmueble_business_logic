import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Property, PropertyRelations, Advisor, PropertyStatus, City, OfferType, PropertyManager, PropertyType, PropertyPicture, Request} from '../models';
import {AdvisorRepository} from './advisor.repository';
import {PropertyStatusRepository} from './property-status.repository';
import {CityRepository} from './city.repository';
import {OfferTypeRepository} from './offer-type.repository';
import {PropertyManagerRepository} from './property-manager.repository';
import {PropertyTypeRepository} from './property-type.repository';
import {PropertyPictureRepository} from './property-picture.repository';
import {RequestRepository} from './request.repository';

export class PropertyRepository extends DefaultCrudRepository<
  Property,
  typeof Property.prototype.id,
  PropertyRelations
> {

  public readonly advisor: BelongsToAccessor<Advisor, typeof Property.prototype.id>;

  public readonly propertyStatus: BelongsToAccessor<PropertyStatus, typeof Property.prototype.id>;

  public readonly city: BelongsToAccessor<City, typeof Property.prototype.id>;

  public readonly offerType: BelongsToAccessor<OfferType, typeof Property.prototype.id>;

  public readonly propertyManager: BelongsToAccessor<PropertyManager, typeof Property.prototype.id>;

  public readonly propertyType: BelongsToAccessor<PropertyType, typeof Property.prototype.id>;

  public readonly propertyPictures: HasManyRepositoryFactory<PropertyPicture, typeof Property.prototype.id>;

  public readonly requests: HasManyRepositoryFactory<Request, typeof Property.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('AdvisorRepository') protected advisorRepositoryGetter: Getter<AdvisorRepository>, @repository.getter('PropertyStatusRepository') protected propertyStatusRepositoryGetter: Getter<PropertyStatusRepository>, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>, @repository.getter('OfferTypeRepository') protected offerTypeRepositoryGetter: Getter<OfferTypeRepository>, @repository.getter('PropertyManagerRepository') protected propertyManagerRepositoryGetter: Getter<PropertyManagerRepository>, @repository.getter('PropertyTypeRepository') protected propertyTypeRepositoryGetter: Getter<PropertyTypeRepository>, @repository.getter('PropertyPictureRepository') protected propertyPictureRepositoryGetter: Getter<PropertyPictureRepository>, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Property, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
    this.propertyPictures = this.createHasManyRepositoryFactoryFor('propertyPictures', propertyPictureRepositoryGetter,);
    this.registerInclusionResolver('propertyPictures', this.propertyPictures.inclusionResolver);
    this.propertyType = this.createBelongsToAccessorFor('propertyType', propertyTypeRepositoryGetter,);
    this.registerInclusionResolver('propertyType', this.propertyType.inclusionResolver);
    this.propertyManager = this.createBelongsToAccessorFor('propertyManager', propertyManagerRepositoryGetter,);
    this.registerInclusionResolver('propertyManager', this.propertyManager.inclusionResolver);
    this.offerType = this.createBelongsToAccessorFor('offerType', offerTypeRepositoryGetter,);
    this.registerInclusionResolver('offerType', this.offerType.inclusionResolver);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter,);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
    this.propertyStatus = this.createBelongsToAccessorFor('propertyStatus', propertyStatusRepositoryGetter,);
    this.registerInclusionResolver('propertyStatus', this.propertyStatus.inclusionResolver);
    this.advisor = this.createBelongsToAccessorFor('advisor', advisorRepositoryGetter,);
    this.registerInclusionResolver('advisor', this.advisor.inclusionResolver);
  }
}
