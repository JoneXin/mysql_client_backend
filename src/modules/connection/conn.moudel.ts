import { Module } from '@nestjs/common';
import { ConnController } from './conn.controller';
import ConnectionList from '../../entities/conn.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnService } from './conn.service';

@Module({
  controllers: [ConnController],
  imports: [TypeOrmModule.forFeature([ConnectionList])],
  providers: [ConnService],
  exports: [ConnService],
})
export class ConnModule {}
