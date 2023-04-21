import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {GeneralSystemVariables, GeneralSystemVariablesRelations} from '../models';

export class GeneralSystemVariablesRepository extends DefaultCrudRepository<
  GeneralSystemVariables,
  typeof GeneralSystemVariables.prototype.id,
  GeneralSystemVariablesRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(GeneralSystemVariables, dataSource);
  }
}
