import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const serverConfig: any = config.get('server');
  const logger = new Logger('bootstrap')

  const app = await NestFactory.create(AppModule, { cors: true });
  
  const configService = app.get(ConfigService);
  
  // app.setGlobalPrefix('/api')
  // if (configService.get('NODE_ENV') === 'development') {
  //   app.enableCors({
  //     origin: 'http://localhost:3050',
  //     credentials: true
  //   });
  // } else {
  //   app.enableCors({ origin: serverConfig.origin });
  // }

  const port = configService.get('PORT') || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();


