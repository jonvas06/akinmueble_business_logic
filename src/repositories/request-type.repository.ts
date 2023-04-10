import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {RequestType, RequestTypeRelations, Request} from '../models';
import {RequestRepository} from './request.repository';

export class RequestTypeRepository extends DefaultCrudRepository<
  RequestType,
  typeof RequestType.prototype.id,
  RequestTypeRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof RequestType.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(RequestType, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
