import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CompareConf } from './sys.class';
import { SysService } from './sys.service';

@Controller('sys')
export class SysController {
  constructor(private sysService: SysService) {}

  @Post('/compare')
  async compareSyncDbList(@Body() Info: CompareConf) {
    return this.sysService.compareSyncDbList(Info);
  }
}
