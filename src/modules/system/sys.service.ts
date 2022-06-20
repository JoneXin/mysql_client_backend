import { DbService } from './../database/db.service';
import { Injectable } from '@nestjs/common';
import { ConnService } from '../connection/conn.service';
import { CompareConf } from './sys.class';

@Injectable()
export class SysService {
  constructor(private connService: ConnService, private dbService: DbService) {}

  /**
   * 数据库头同步对比
   * @param compareInfo
   */
  async compareSyncDbList(compareInfo: CompareConf) {
    const { originConnConf, aimConnConf, dbTreeList } = compareInfo;
    const conn = this.dbService.getCurrentConnHandle(aimConnConf);
    const [aimDblist] = await conn.promise().query('show databases');
    const compareTreelist = [];
    const aimTableMap = new Map();
    // 对比
    for (let i = 0; i < dbTreeList.length; i++) {
      const dbInfo = dbTreeList[i];
      // 目标库
      const aimDb = (aimDblist as Array<any>).find(
        (db) => db.Database == dbInfo.name,
      );

      // db compare
      compareTreelist.push({
        originName: dbInfo.name,
        aimName: dbInfo.name,
        isExist: !!aimDb,
        key: i,
        children: !aimDb
          ? dbInfo.children.map((v, j) => ({
              originName: v.name,
              aimName: '',
              isExist: false,
              key: `${i}-${j}`,
            }))
          : [],
      });

      // table compare
      if (aimDb) {
        // aim table
        const [tables] = await conn
          .promise()
          .query(`show tables from  ${aimDb.Database}`);
        const tableUnion = [
          ...new Set([
            ...dbInfo.children.map((t) => t.name),
            ...(tables as Array<any>).map((t) => t[`Tables_in_${dbInfo.name}`]),
          ]),
        ];

        // 存进Map
        (tables as Array<any>).forEach((tableInfo) => {
          aimTableMap.set(
            tableInfo[`Tables_in_${dbInfo.name}`],
            tableInfo[`Tables_in_${dbInfo.name}`],
          );
        });

        //对比
        tableUnion.map((tableName, index) => {
          // 源表
          if (index < dbInfo.children.length) {
            compareTreelist[compareTreelist.length - 1].children.push({
              originName: tableName,
              key: `${i}-${index}`,
              aimName: aimTableMap.get(tableName),
              isExist: !!aimTableMap.get(tableName),
            });
          } else {
            // 目标表
            compareTreelist[compareTreelist.length - 1].children.push({
              originName: null,
              key: `${i}-${index}`,
              aimName: aimTableMap.get(tableName),
              isExist: false,
            });
          }
        });
      }
    }

    return compareTreelist;
  }
}
