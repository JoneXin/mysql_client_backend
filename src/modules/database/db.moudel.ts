import { Module } from '@nestjs/common';
import { ConnModule } from '../connection/conn.moudel';
import { DbController } from './db.controller';
import { DbService } from './db.service';
@Module({
  controllers: [DbController],
  imports: [ConnModule],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
