import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Advisor, AdvisorRelations, Property, AdvisorStatus, Request} from '../models';
import {PropertyRepository} from './property.repository';
import {AdvisorStatusRepository} from './advisor-status.repository';
import {RequestRepository} from './request.repository';

export class AdvisorRepository extends DefaultCrudRepository<
  Advisor,
  typeof Advisor.prototype.id,
  AdvisorRelations
> {

  public readonly properties: HasManyRepositoryFactory<Property, typeof Advisor.prototype.id>;

  public readonly advisorStatus: BelongsToAccessor<AdvisorStatus, typeof Advisor.prototype.id>;

  public readonly requests: HasManyRepositoryFactory<Request, typeof Advisor.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>, @repository.getter('AdvisorStatusRepository') protected advisorStatusRepositoryGetter: Getter<AdvisorStatusRepository>, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Advisor, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
    this.advisorStatus = this.createBelongsToAccessorFor('advisorStatus', advisorStatusRepositoryGetter,);
    this.registerInclusionResolver('advisorStatus', this.advisorStatus.inclusionResolver);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
  }
}
