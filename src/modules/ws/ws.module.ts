import { Module } from '@nestjs/common';
import { WsGateway } from './ws.getway';

@Module({
  controllers: [],
  imports: [],
  providers: [WsGateway],
  exports: [],
})
export class WsModule {}
