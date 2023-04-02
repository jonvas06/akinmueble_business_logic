import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {SecurityConfiguration} from '../config/security.config';

const config = {
  name: 'mysql',
  connector: 'mysql',
  url: '',
  host: SecurityConfiguration.hostDb,
  port: SecurityConfiguration.PORT_DB,
  user: SecurityConfiguration.userDb,
  password: SecurityConfiguration.passwordDb,
  database: SecurityConfiguration.dataBase,
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
