import { Connection } from 'mysql2';
import { exec } from 'shelljs';

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
