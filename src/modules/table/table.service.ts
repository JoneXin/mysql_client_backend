import { DatabaseConf } from './table.class';
import { Injectable } from '@nestjs/common';
import { DbService } from '../database/db.service';

@Injectable()
export class TableService {
  constructor(private dbService: DbService) {}

  /**
   * 获取指定数据库下的所有表
   * @param dbName
   * @returns
   */
  async getTablelist(dbConf: DatabaseConf): Promise<Array<string>> {
    const conn = this.dbService.getCurrentConnHandle(dbConf);
    const [lists] = await conn
      .promise()
      .query(`show tables from ${dbConf.database}`);
    return (lists as Array<any>).map((item) => item[0]);
  }
}
