import { ConnMysqlConf } from './conn.class';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ConnectionList from '../../entities/conn.entity';
import { DelConnDto, UpdateConnDto } from './conn.dto';

@Injectable()
export class ConnService {
  constructor(
    @InjectRepository(ConnectionList)
    private connRepository: Repository<ConnectionList>,
  ) {}

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
  async delConnection(connName: DelConnDto): Promise<boolean> {
    await this.connRepository.delete(connName);
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
}
