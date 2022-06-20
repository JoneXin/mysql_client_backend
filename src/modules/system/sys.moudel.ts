import { Module } from '@nestjs/common';
import { ConnModule } from '../connection/conn.moudel';
import { DbModule } from '../database/db.moudel';
import { SysController } from './sys.controller';
import { SysService } from './sys.service';
@Module({
  controllers: [SysController],
  imports: [ConnModule, DbModule],
  providers: [SysService],
  exports: [],
})
export class SysModule {}
