import { ConnMysqlConf } from './../modules/connection/conn.class';
import { Connection } from 'mysql2';
import { exec } from 'shelljs';
import { ExportConf } from '../typings';
import { resolve } from 'path';
import fs from 'fs-extra';
import { readFileSync, writeFileSync } from 'fs';
/**
 * promise 化 回调直接结果
 * @param command
 * @returns
 */
export function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (code) => {
      if (code == 0) resolve(true);
      reject(false);
    });
  });
}

/**
 * 事务操作
 * @param connection
 * @param sqls
 * @param params
 * @returns
 */
export function transaction(connection: any, sqls: Array<string>) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((beginErr) => {
      if (beginErr) console.log(beginErr);

      console.log('开始执行事务，共执行' + sqls.length + '条语句');
      // 返回一个promise 数组
      const funcAry = sqls.map((sql, index) => {
        return new Promise((sqlResolve, sqlReject) => {
          console.log('开始执行' + sqls[index]);
          connection.query(sql, (sqlErr, result) => {
            if (sqlErr) {
              console.log(`第${index + 1}条语句执行错误!`, sqlErr);
              return sqlReject(sqlErr);
            }
            sqlResolve(result);
          });
        });
      });
      // 使用all 方法 对里面的每个promise执行的状态 检查
      Promise.all(funcAry)
        .then((arrResult) => {
          // 提交事务
          connection.commit(function (commitErr) {
            if (commitErr) {
              // 提交事务失败了
              console.log('提交事务失败:' + commitErr);
              // 事务回滚，之前运行的sql语句不生效
              connection.rollback(function (err) {
                if (err) console.log('回滚失败：' + err);
              });
              // 返回promise失败状态
              return reject(commitErr);
            }

            // 事务成功 返回 每个sql运行的结果 是个数组结构
            resolve(arrResult);
          });
        })
        .catch((error) => {
          // 多条sql语句执行中 其中有一条报错 直接回滚
          connection.rollback(function () {
            console.log('sql运行失败： ' + JSON.stringify(error));

            reject(error);
          });
        });
    });
  });
}

/**
 * 导出 selectDbTreeNode 中库表的 数据结构
 * @param exportConf
 * @param conn
 * @param tempDir
 * @param selectDbTreeNode
 */
export async function handleExportStruct(
  exportConf: ExportConf,
  conn: Connection,
  tempDir: string,
  dbConf: ConnMysqlConf,
  dbTreeList: Array<any>,
): Promise<void> {
  const {
    isExportTableData,
    isExportPureStruct,
    isAutoCreateDb,
    isForceUpdateDb,
    isForceUpdateTable,
  } = exportConf;

  for (let i = 0; i < dbTreeList.length; i++) {
    const dbInfo = dbTreeList[i];
    // 拼接导出的表列表
    const tableListStr = await getTableListStr(dbInfo, conn);
    let createDbSql = '';

    // 强制更新
    if (isForceUpdateDb) {
      createDbSql += `DROP DATABASE if EXISTS ${dbInfo.name}; \n`;
    }

    // 自动建库
    if (isAutoCreateDb) {
      // create db sql
      createDbSql += await getCreateDbSql(dbInfo, conn);
      // use db sql
      createDbSql += `use ${dbInfo.name}; \n`;
    }

    // 导出结构
    ExportStruct(
      dbConf,
      dbInfo,
      exportConf,
      tempDir,
      tableListStr,
      createDbSql,
    );

    // 导出数据
    if (isExportTableData) ExportData(dbConf, dbInfo, tempDir, tableListStr);
  }
}

/**
 * 拼接配置表列表
 * @param dbInfo
 * @param conn
 * @returns
 */
async function getTableListStr(dbInfo: any, conn: Connection): Promise<string> {
  let tableListStr = '';
  if (dbInfo.syncAllTable) {
    // 表列表
    const [res] = await conn.promise().query(`show tables from ${dbInfo.name}`);
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

  return tableListStr;
}

/**
 *  获取创建数据库的sql
 * @param dbInfo
 * @param conn
 * @returns
 */
async function getCreateDbSql(dbInfo: any, conn: Connection) {
  // 查看源数据库的数据库编码
  const [dbCreateSqlArr] = await conn
    .promise()
    .query(`show create database ${dbInfo.name}`);
  return dbCreateSqlArr[0]['Create Database'] + ';\n';
}

/**
 * 返回导出语句
 * @param dbConf
 * @param dbInfo
 * @param exportConf
 * @param tempDir
 * @param tableListStr
 * @returns
 */
async function ExportStruct(
  dbConf: ConnMysqlConf,
  dbInfo: any,
  exportConf: ExportConf,
  tempDir: string,
  tableListStr: string,
  createDbSql: string,
): Promise<string> {
  // 导出结构语句
  // 是否添加 drop 语句}
  const execComand = `mysqldump --host=${dbConf.host}  -u${dbConf.user} -p${
    dbConf.password
  } -P${dbConf.port} --databases ${
    dbInfo.name
  } --tables ${tableListStr} --no-data${
    !exportConf.isForceUpdateTable ? ' --skip-add-drop-table ' : ''
  } --skip-comments > ${tempDir}_${dbInfo.name}_struct.sql`;

  // 执行导出操作
  await execAsync(execComand);

  // 处理导出的表结构
  handleExportStructSql(
    `${tempDir}_${dbInfo.name}_struct.sql`,
    exportConf.isForceUpdateTable,
    createDbSql,
  );

  // 返回导出的路径
  return `${tempDir}_${dbInfo.name}_struct.sql`;
}

/**
 * 导出数据
 * @param dbConf
 * @param dbInfo
 * @param tempDir
 * @param tableListStr
 * @returns
 */
async function ExportData(
  dbConf: ConnMysqlConf,
  dbInfo: any,
  tempDir: string,
  tableListStr: string,
): Promise<string> {
  // 导出结构语句
  const exportComandData = `mysqldump --host=${dbConf.host}  -u${dbConf.user} -p${dbConf.password}  -P${dbConf.port}  --databases ${dbInfo.name}  --tables ${tableListStr} --no-create-info > ${tempDir}_${dbInfo.name}_data.sql`;
  //导出源库表结构 和 <数据>
  await execAsync(exportComandData);

  // 返回导出的路径
  return `${tempDir}_${dbInfo.name}_data.sql`;
}

/**
 * 修改默认的导出语句，添加创建db 和 替换 创建表的语句
 * @param filePath
 * @param sourceStr
 * @param aimStr
 */
function handleExportStructSql(
  filePath: string,
  isForceUpdateTable,
  createDbsql: string,
) {
  try {
    let sqlStructStr = readFileSync(filePath, 'utf8');
    // 不强制更新表
    if (!isForceUpdateTable) {
      let replacedStr = reaplaceCreateTableSql(
        'CREATE TABLE',
        'CREATE TABLE IF NOT EXISTS',
        sqlStructStr,
      );
      replacedStr = createDbsql + replacedStr;
      return writeFileSync(filePath, replacedStr);
    }
    // 强制更新表
    sqlStructStr = createDbsql + sqlStructStr;
    writeFileSync(filePath, sqlStructStr);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

/**
 * 把 targetStr 中的 sourceStr  替换成 aimStr
 * @param sourceStr
 * @param aimStr
 * @param targetStr
 */
function reaplaceCreateTableSql(sourceStr, aimStr, targetStr) {
  return targetStr.replace(new RegExp(sourceStr, 'g'), aimStr);
}
