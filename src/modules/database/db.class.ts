import { ConnMysqlConf } from '../connection/conn.class';
export interface DbQueryConfig extends ConnMysqlConf {
  query_content?: string;
  database?: string;
}
