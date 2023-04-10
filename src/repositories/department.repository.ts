import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Department, DepartmentRelations, City} from '../models';
import {CityRepository} from './city.repository';

export class DepartmentRepository extends DefaultCrudRepository<
  Department,
  typeof Department.prototype.id,
  DepartmentRelations
> {

  public readonly cities: HasManyRepositoryFactory<City, typeof Department.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(Department, dataSource);
    this.cities = this.createHasManyRepositoryFactoryFor('cities', cityRepositoryGetter,);
    this.registerInclusionResolver('cities', this.cities.inclusionResolver);
  }
}
