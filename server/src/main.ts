import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap')

  const app = await NestFactory.create(AppModule, { cors: true });
  
  const configService = app.get(ConfigService);
  
  // if (configService.get('NODE_ENV') === 'development') {
  //   app.enableCors({
  //     origin: 'http://localhost:3050',
  //     credentials: true
  //   });
  // } else {
  //   app.enableCors({ origin: configService.get('origin') });
  // }

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();


