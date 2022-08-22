export interface ConnMysqlConf {
  // 连接名
  connection_name: string;
  // 主机
  host: string;
  // 端口
  port: string;
  // 用户名
  user: string;
  // 密码
  password: string;
}

export interface ExportConf {
  isExportTableData: boolean;
  isExportPureStruct: boolean;
  isAutoCreateDb: boolean;
  isForceUpdateDb: boolean;
  isForceUpdateTable: boolean;
}
