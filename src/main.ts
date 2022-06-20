import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/api.transform.interpter';

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

  await app.listen(PORT, '0.0.0.0', () => {
    console.log('服务器启动:http://localhost:4545');
  });
}
bootstrap();
