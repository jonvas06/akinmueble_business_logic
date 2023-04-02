import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Request, RequestRelations, Property, Report, Advisor, RequestType, RequestStatus, Customer} from '../models';
import {PropertyRepository} from './property.repository';
import {ReportRepository} from './report.repository';
import {AdvisorRepository} from './advisor.repository';
import {RequestTypeRepository} from './request-type.repository';
import {RequestStatusRepository} from './request-status.repository';
import {CustomerRepository} from './customer.repository';

export class RequestRepository extends DefaultCrudRepository<
  Request,
  typeof Request.prototype.id,
  RequestRelations
> {

  public readonly property: BelongsToAccessor<Property, typeof Request.prototype.id>;

  public readonly reports: HasManyRepositoryFactory<Report, typeof Request.prototype.id>;

  public readonly advisor: BelongsToAccessor<Advisor, typeof Request.prototype.id>;

  public readonly requestType: BelongsToAccessor<RequestType, typeof Request.prototype.id>;

  public readonly requestStatus: BelongsToAccessor<RequestStatus, typeof Request.prototype.id>;

  public readonly customer: BelongsToAccessor<Customer, typeof Request.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>, @repository.getter('ReportRepository') protected reportRepositoryGetter: Getter<ReportRepository>, @repository.getter('AdvisorRepository') protected advisorRepositoryGetter: Getter<AdvisorRepository>, @repository.getter('RequestTypeRepository') protected requestTypeRepositoryGetter: Getter<RequestTypeRepository>, @repository.getter('RequestStatusRepository') protected requestStatusRepositoryGetter: Getter<RequestStatusRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Request, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
    this.requestStatus = this.createBelongsToAccessorFor('requestStatus', requestStatusRepositoryGetter,);
    this.registerInclusionResolver('requestStatus', this.requestStatus.inclusionResolver);
    this.requestType = this.createBelongsToAccessorFor('requestType', requestTypeRepositoryGetter,);
    this.registerInclusionResolver('requestType', this.requestType.inclusionResolver);
    this.advisor = this.createBelongsToAccessorFor('advisor', advisorRepositoryGetter,);
    this.registerInclusionResolver('advisor', this.advisor.inclusionResolver);
    this.reports = this.createHasManyRepositoryFactoryFor('reports', reportRepositoryGetter,);
    this.registerInclusionResolver('reports', this.reports.inclusionResolver);
    this.property = this.createBelongsToAccessorFor('property', propertyRepositoryGetter,);
    this.registerInclusionResolver('property', this.property.inclusionResolver);
  }
}
