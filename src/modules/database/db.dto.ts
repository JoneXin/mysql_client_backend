import { ConnMysqlConf } from './../connection/conn.class';
import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsPort,
  IsIP,
  IsArray,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class SyncConf {
  @IsArray()
  dbTreeList: Array<any>;

  @IsObject()
  aimConnInfo: ConnMysqlConf;

  @IsObject()
  orginConnInfo: ConnMysqlConf;

  @IsBoolean()
  isSyncTableData: boolean;

  @IsBoolean()
  isForceUpdate: boolean;
}
