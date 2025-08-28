import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // if you want to see logs of debug level, change the level in the logger options
    // example:
    // level: 'debug',
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new DailyRotateFile({
          filename: 'logs/miniPos-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
  });

  const config = new DocumentBuilder()
    .setTitle('MiniPos API')
    .setDescription('API documentation for MiniPos application')
    .setVersion('1.0')
    .addTag('mini-pos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
