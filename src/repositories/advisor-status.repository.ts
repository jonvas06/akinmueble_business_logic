import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {AdvisorStatus, AdvisorStatusRelations, Advisor} from '../models';
import {AdvisorRepository} from './advisor.repository';

export class AdvisorStatusRepository extends DefaultCrudRepository<
  AdvisorStatus,
  typeof AdvisorStatus.prototype.id,
  AdvisorStatusRelations
> {

  public readonly advisors: HasManyRepositoryFactory<Advisor, typeof AdvisorStatus.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('AdvisorRepository') protected advisorRepositoryGetter: Getter<AdvisorRepository>,
  ) {
    super(AdvisorStatus, dataSource);
    this.advisors = this.createHasManyRepositoryFactoryFor('advisors', advisorRepositoryGetter,);
    this.registerInclusionResolver('advisors', this.advisors.inclusionResolver);
  }
}
