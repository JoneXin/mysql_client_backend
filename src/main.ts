import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/api.transform.interpter';
import { WsAdapter } from './modules/ws/ws.adaptor';
import { join } from 'path';

const PORT = process.env.PORT || 4545;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 全局验证
  app.useGlobalPipes(new ValidationPipe());

  // 拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // WS 适配器
  app.useWebSocketAdapter(new WsAdapter(app));

  app.useStaticAssets({ root: join(__dirname, '..', 'public') });

  await app.listen(PORT, '0.0.0.0', () => {
    console.log('服务器启动:http://localhost:4545');
  });
}
bootstrap();
