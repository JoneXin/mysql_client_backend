import { ConnMysqlConf } from '../connection/conn.class';
export interface DbQueryConfig extends ConnMysqlConf {
  query_content?: string;
  database?: string;
}

export interface ExportConf {
  connInfo: ConnMysqlConf;
  isExportTableData: boolean;
  isExportPureStruct: boolean;
  isAutoCreateDb: boolean;
  isForceUpdateDb: boolean;
  isForceUpdateTable: boolean;
  dbTreeList: Array<any>;
}
