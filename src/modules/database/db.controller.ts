import { ConnMysqlConf } from './../connection/conn.class';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DbService } from './db.service';
import { DbQueryConfig } from './db.class';

@Controller('db')
export class DbController {
  constructor(private dbService: DbService) {}

  @Post('/list')
  async showDatabases(@Body() connConf: ConnMysqlConf) {
    return await this.dbService.getDblist(connConf);
  }

  @Post('/query')
  async querySql(@Body() queryObj: DbQueryConfig) {
    return await this.dbService.query(queryObj);
  }

}
