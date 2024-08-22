import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { LoggerService } from './utils/logger/logger.service';

// BEGIN-NOSCAN
/**
 * Enable this when use cooke and scrf
 * Enable this when use logger
 */
// import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';

// END-NOSCAN

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);

  // BEGIN-NOSCAN
  /**
   * Add configuration and security
   * Enable when use prefix if you want
   * Enable when use cooke and scrf
   * Enable when when use logger
   */
  // app.setGlobalPrefix('api');
  // app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  // app.use((req: any, res: any, next: any) => {
  //   const token = req.csrfToken();
  //   res.cookie('XSRF-TOKEN', token);
  //   res.locals.csrfToken = token;
  //   next();
  // });
  // END-NOSCAN
  app.useLogger(app.get(LoggerService));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableCors();
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('NestJst Starter')
    .setDescription('Lorem ipsum dolor set amet')
    .setVersion('1.0')
    .addTag('My API TAG')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(3000);
}
bootstrap();
