import { ConnMysqlConf } from './../connection/conn.class';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbService } from './db.service';

@Controller('db')
export class DbController {
  constructor(private dbService: DbService) {}

  @Post('/list')
  async showDatabases(@Body() connConf: ConnMysqlConf) {
    return await this.dbService.getDblist(connConf);
  }

  @Post('/query')
  async getAllConnectionList(@Body() queryObj) {
    return await this.dbService.query(queryObj);
  }
}
