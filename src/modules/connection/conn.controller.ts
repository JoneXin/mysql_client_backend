import { ConnMysqlConf } from './conn.class';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConnService } from './conn.service';
import { ConnMysqlDto, DelConnDto, UpdateConnDto } from './conn.dto';

@Controller('conn')
export class ConnController {
  constructor(private connService: ConnService) {}

  @Get('/connectionlist')
  async getAllConnectionList() {
    return await this.connService.getAllConnList();
  }

  @Post('/newconnection')
  async newConnection(@Body() connConf: ConnMysqlDto): Promise<boolean> {
    return await this.connService.newConnection(connConf);
  }

  @Get('/delconnection')
  async delConnection(@Query() param: DelConnDto): Promise<boolean> {
    return await this.connService.delConnection(param);
  }

  @Post('/updateconnection')
  async updateConnection(
    @Body() updateConnConf: UpdateConnDto,
  ): Promise<boolean> {
    return await this.connService.updateConnection(updateConnConf);
  }
}
