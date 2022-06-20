import { ConnMysqlConf } from '../connection/conn.class';
export interface CompareConf {
  originConnConf: ConnMysqlConf;
  aimConnConf: ConnMysqlConf;
  dbTreeList: any;
}
