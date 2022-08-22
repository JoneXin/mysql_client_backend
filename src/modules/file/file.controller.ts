import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { FileDto } from './file.dto';
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('/list')
  async getFloderList(@Query() query: FileDto) {
    return await this.fileService.getFileChilren(query);
  }
}
