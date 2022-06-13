import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TableService } from './table.service';
import { DatabaseConf } from './table.class';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post('/list')
  async showDatabases(@Body() dbConf: DatabaseConf) {
    return await this.tableService.getTablelist(dbConf);
  }
}
