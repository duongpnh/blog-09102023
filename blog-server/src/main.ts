import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { GeneralLogger } from './logger/general.logger';
import { setupSwagger } from '@config/swagger.config';
import { RequestExceptionFilter } from '@exceptions/request.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(GeneralLogger));

  // CORS
  app.enableCors();
  // Compression can greatly decrease the size of the response body, thereby increasing the speed of a web app
  app.use(compression());
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );
  // setup swagger
  setupSwagger(app);

  // add filter exception
  const reflector = app.get(Reflector);
  const logger = app.get(GeneralLogger);
  app.useGlobalFilters(new RequestExceptionFilter(reflector, logger));

  const { PORT } = process.env;

  await app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));
}
bootstrap();
