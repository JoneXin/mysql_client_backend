import { ConnMysqlConf } from './../connection/conn.class';
export interface DatabaseConf extends ConnMysqlConf {
  database: string;
}
