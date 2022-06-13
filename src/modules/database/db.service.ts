import { ConnMysqlConf } from './../connection/conn.class';
import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { ConnService } from '../connection/conn.service';
import { DbQueryConfig } from './db.class';

@Injectable()
export class DbService {
  constructor(private connService: ConnService) {}

  async getDblist(connConf: ConnMysqlConf): Promise<Array<string>> {
    console.log(connConf);

    const conn = this.getCurrentConnHandle(connConf);

    try {
      const [lists] = await conn.promise().query('show databases');
      console.log(lists);
      return (lists as Array<any>).map((item) => item[0]);
    } catch (error) {
      return [error];
    }
  }

  /**
   * 在某库运行sql
   * @param queryObj
   * @returns
   */
  async query(queryObj: DbQueryConfig): Promise<boolean> {
    const conn = this.getCurrentConnHandle(queryObj);
    await conn.query(queryObj.query_content);
    return true;
  }

  /**
   * 根据连接配置获取连接对象
   * @param connName
   * @returns
   */
  getCurrentConnHandle(connConf: DbQueryConfig): Connection {
    for (const item of this.connService.connMap) {
      if (item[0] == connConf.connection_name) {
        return item[1];
      }
    }

    return this.connService.connectHandle(connConf);
  }
}
