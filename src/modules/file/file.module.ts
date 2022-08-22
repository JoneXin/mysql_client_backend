import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileService } from './file.service';
@Module({
  controllers: [FileController],
  imports: [],
  providers: [FileService],
  exports: [],
})
export class FileModule {}
