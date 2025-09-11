import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
// import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { ErrorException } from '@/common/filters/error.filter';
import { ValidationPipe } from '@nestjs/common';
import { CustomStatusInterceptor } from './common/interceptors/post-status.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: process.env.NODE_ENV !== 'production',
  });

  const config = new DocumentBuilder()
    .setTitle('RealWorld API')
    .setDescription('RealWorld API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
      },
      'refreshToken',
    )
    .setBasePath('/api')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory(), {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // This hides the models/schemas section
    },
  });

  app.useGlobalInterceptors(new CustomStatusInterceptor());
  // app.useGlobalInterceptors(new TransformInterceptor());
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
