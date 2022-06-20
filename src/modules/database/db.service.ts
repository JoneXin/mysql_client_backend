import { SyncConf } from './db.dto';
import { ConnMysqlConf } from './../connection/conn.class';
import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { ConnService } from '../connection/conn.service';
import { DbQueryConfig } from './db.class';
import { join, resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { execAsync } from '../../utils/tool';
import { ensureDirSync, remove } from 'fs-extra';
import { opendir } from 'fs/promises';
@Injectable()
export class DbService {
  constructor(private connService: ConnService) {}

  async getDblist(connConf: ConnMysqlConf): Promise<Array<string>> {
    const conn = this.getCurrentConnHandle(connConf);

    try {
      const [lists] = await conn.promise().query('show databases');

      return (lists as Array<any>).map((item) => item.Database);
    } catch (error) {
      return [error];
    }
  }

  /**
   * 在某库运行sql
   * @param queryObj
   * @returns
   */
  async query(queryObj: DbQueryConfig): Promise<any> {
    const conn = this.getCurrentConnHandle(queryObj);
    try {
      const [list, fields] = await conn.promise().query(queryObj.query_content);
      return {
        list,
        fields: fields.map((item) => ({
          title: item.name,
          key: item.name,
          dataIndex: item.name,
          type: item.type,
          decimals: item.decimals,
        })),
      };
    } catch (error) {
      throw error;
    }
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

  /**
   * 同步数据
   * @param syncObj
   * @returns
   */
  async syncDatabases(syncObj: SyncConf): Promise<void> {
    const { orginConnInfo, aimConnInfo } = syncObj;
    const dbCreaterMap = new Map();
    const connOrigin = this.getCurrentConnHandle(orginConnInfo);
    const connAim = this.getCurrentConnHandle(aimConnInfo);

    // 零时sql文件存储目录
    const tempDir = this.getTempDir();

    // 导出
    await this.handleExportSql(syncObj, connOrigin, tempDir, dbCreaterMap);
    // 导入
    await this.handleImportSql(syncObj, connAim, tempDir, dbCreaterMap);
  }

  /**
   * 导出.sql
   * @param syncObj
   * @param connOrigin
   * @param tempDir
   * @param dbCreaterMap
   */
  async handleExportSql(syncObj, connOrigin, tempDir, dbCreaterMap) {
    const { orginConnInfo, dbTreeList, isForceUpdate, isSyncTableData } =
      syncObj;

    // 处理数据库的导出
    for (let i = 0; i < dbTreeList.length; i++) {
      const dbInfo = dbTreeList[i];

      let tableListStr = '';
      // 所有表
      if (dbInfo.syncAllTable) {
        // 表列表
        const [res] = await connOrigin
          .promise()
          .query(`show tables from ${dbInfo.name}`);
        // 处理成字符串列表
        (res as Array<any>).forEach((table) => {
          tableListStr += `${table['Tables_in_' + dbInfo.name]} `;
        });
      } else {
        // 同步部分表
        dbInfo.children.forEach((table) => {
          tableListStr += `${table.name} `;
        });
      }

      // 生成此.sql 文件名
      const uuid = uuidv4();

      // 查看源数据库的数据库编码
      const [dbCreateSqlArr] = await connOrigin
        .promise()
        .query(`show create database ${dbInfo.name}`);

      // 存储建库语句 后面导入根据配置建库
      const createDbSql = dbCreateSqlArr[0]['Create Database'];
      dbCreaterMap.set(`${uuid}.sql`, { createDbSql, dbName: dbInfo.name });

      // export 语句
      const exportCommand = `mysqldump --host=${orginConnInfo.host}  -u${
        orginConnInfo.user
      } -p${orginConnInfo.password} -P${orginConnInfo.port} ${
        // 是否同步数据
        !isSyncTableData ? '--no-data' : ' '
        // 是否删除目标库
      } ${isForceUpdate ? '--add-drop-database' : ' '}  --databases ${
        dbInfo.name
      } --tables ${tableListStr}  > ${resolve(tempDir, uuid)}.sql`;

      console.log(exportCommand);

      //导出源库表结构 和 <数据>
      await execAsync(exportCommand);

      console.log(`${dbInfo.name} 导出成功 ==> ${tempDir}`);
    }
  }

  /**
   * 导入.sql
   * @param syncObj
   * @param connAim
   * @param tempDir
   * @param dbCreaterMap
   * @returns
   */
  async handleImportSql(syncObj, connAim, tempDir, dbCreaterMap) {
    const { aimConnInfo, isForceUpdate } = syncObj;

    // 导入
    try {
      const dir = await opendir(tempDir);
      // 循环导入
      for await (const dirent of dir) {
        const sqlPath = resolve(tempDir, dirent.name);

        // 是否强制更新
        if (isForceUpdate) {
          await connAim
            .promise()
            .query(
              `DROP DATABASE IF EXISTS ${dbCreaterMap.get(dirent.name).dbName}`,
            );
        }

        // 创建数据库
        await connAim
          .promise()
          .query(dbCreaterMap.get(dirent.name).createDbSql);

        // 导入到库
        await execAsync(
          `mysql -u${aimConnInfo.user} -p${aimConnInfo.password} -h${
            aimConnInfo.host
          } -P${aimConnInfo.port} -D${
            dbCreaterMap.get(dirent.name).dbName
          } < ${sqlPath}`,
        );

        console.log(`${dbCreaterMap.get(dirent.name).dbName}导入成功!`);
      }

      // 删除chache 的 文件
      remove(tempDir, (err) => {
        if (err) return console.error(err);
        console.log('cleanning this cache!');
      });
    } catch (err) {
      console.error(err);
      remove(tempDir, (err) => {
        if (err) return console.error(err);
        console.log('error!! cleanning this cache!');
      });
      return false;
    }
  }

  /**
   * 返回临时存储目录
   * @returns
   */
  getTempDir(): string {
    // 这次任务的零时目录名
    const dirTemp = String(Date.now());
    // 完成目录
    const tempDir = resolve(join(__dirname, '../../../.temp'), dirTemp);

    // 创建
    ensureDirSync(tempDir);

    return tempDir;
  }
}
