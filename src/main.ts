import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { ErrorException } from '@/common/filters/error.filter';
import { ValidationPipe } from '@nestjs/common';
import { CustomStatusInterceptor } from './common/interceptors/post-status.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new CustomStatusInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new ErrorException());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
