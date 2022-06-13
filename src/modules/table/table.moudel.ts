import { Module } from '@nestjs/common';
import { ConnModule } from '../connection/conn.moudel';
import { DbModule } from '../database/db.moudel';
import { TableController } from './table.controller';
import { TableService } from './table.service';
@Module({
  controllers: [TableController],
  imports: [ConnModule, DbModule],
  providers: [TableService],
  exports: [],
})
export class TableModule {}
