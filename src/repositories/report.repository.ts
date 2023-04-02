import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Report, ReportRelations, Request} from '../models';
import {RequestRepository} from './request.repository';

export class ReportRepository extends DefaultCrudRepository<
  Report,
  typeof Report.prototype.id,
  ReportRelations
> {

  public readonly request: BelongsToAccessor<Request, typeof Report.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Report, dataSource);
    this.request = this.createBelongsToAccessorFor('request', requestRepositoryGetter,);
    this.registerInclusionResolver('request', this.request.inclusionResolver);
  }
}
