import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {RequestStatus, RequestStatusRelations, Request} from '../models';
import {RequestRepository} from './request.repository';

export class RequestStatusRepository extends DefaultCrudRepository<
  RequestStatus,
  typeof RequestStatus.prototype.id,
  RequestStatusRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof RequestStatus.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(RequestStatus, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
