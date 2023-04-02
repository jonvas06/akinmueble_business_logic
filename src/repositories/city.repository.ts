import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {City, CityRelations, Property, Department} from '../models';
import {PropertyRepository} from './property.repository';
import {DepartmentRepository} from './department.repository';

export class CityRepository extends DefaultCrudRepository<
  City,
  typeof City.prototype.id,
  CityRelations
> {

  public readonly properties: HasManyRepositoryFactory<Property, typeof City.prototype.id>;

  public readonly department: BelongsToAccessor<Department, typeof City.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>, @repository.getter('DepartmentRepository') protected departmentRepositoryGetter: Getter<DepartmentRepository>,
  ) {
    super(City, dataSource);
    this.department = this.createBelongsToAccessorFor('department', departmentRepositoryGetter,);
    this.registerInclusionResolver('department', this.department.inclusionResolver);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
  }
}
