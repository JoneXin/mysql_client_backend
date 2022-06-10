import { Connection, createConnection } from 'mysql2';
import { ConnMysqlConf } from '../typings';

/**
 * 测试mysql连接
 * @param connConf
 * @returns
 */
export function testConnection(connConf: ConnMysqlConf): Promise<boolean> {
  const conn = createConnection({
    host: connConf.host,
    port: Number(connConf.port),
    user: connConf.user,
    password: connConf.password,
  });

  return new Promise((resolve) => {
    conn.connect((err) => {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

/**
 * 创建链接
 * @param connConf
 * @returns
 */
export function getConnection(connConf: ConnMysqlConf): Connection {
  return createConnection({
    host: connConf.host,
    port: Number(connConf.port),
    user: connConf.user,
    password: connConf.password,
    charset: 'utf8mb4',
    rowsAsArray: true,
  });
}
