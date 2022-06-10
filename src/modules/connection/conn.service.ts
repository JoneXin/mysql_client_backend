import { Connection } from 'mysql2';
import { ConnMysqlConf } from './conn.class';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ConnectionList from '../../entities/conn.entity';
import { DelConnDto, UpdateConnDto } from './conn.dto';
import { getConnection, testConnection } from '../../utils/mysql_connection';
@Injectable()
export class ConnService {
  public connMap;

  constructor(
    @InjectRepository(ConnectionList)
    private connRepository: Repository<ConnectionList>,
  ) {
    this.connMap = new Map();
  }

  /**
   * 获取所有历史连接
   * @returns
   */
  async getAllConnList(): Promise<Array<ConnectionList>> {
    return await this.connRepository.find();
  }

  /**
   * 新增连接
   * @param connConf
   * @returns
   */
  async newConnection(connConf: ConnMysqlConf): Promise<boolean> {
    await this.connRepository.insert(connConf);
    return true;
  }

  /**
   * 删除连接
   * @param connConf
   * @returns
   */
  async delConnection(uid: number): Promise<boolean> {
    await this.connRepository.delete(uid);
    return true;
  }

  /**
   * 更新连接
   * @param upconnConf
   * @returns
   */
  async updateConnection(upconnConf: UpdateConnDto): Promise<boolean> {
    await this.connRepository.update({ uid: upconnConf.uid }, upconnConf);
    return true;
  }

  /**
   * 测试连接
   * @param connConf
   */
  async testConnection(connConf: ConnMysqlConf): Promise<boolean> {
    return await testConnection(connConf);
  }

  /**
   * 注册连接
   * @param connConf
   * @returns
   */
  connectHandle(connConf: ConnMysqlConf): Connection {
    const conn = getConnection(connConf);
    this.connMap.set(connConf.connection_name, conn);
    return conn;
  }
}
