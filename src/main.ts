import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api")
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, }));
  const config = new DocumentBuilder()
    .setTitle('News API')
    .setDescription('The news API description')
    .setVersion('1.0')
    .addTag('NEWS')

    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    
    swaggerOptions: {
      persistAuthorization: true,
    }

  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
