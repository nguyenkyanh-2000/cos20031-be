import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaClientExceptionFilter } from './core/filters/prisma-client-exception.filter';
import { PrismaClientValidationFilter } from './core/filters/prisma-client-validation.filter';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

declare const module: any;

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_API_TITLE)
    .setDescription(process.env.SWAGGER_API_DESCRIPTION)
    .setVersion(process.env.SWAGGER_API_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(process.env.SWAGGER_API_PREFIX, app, document, {
    jsonDocumentUrl: `${process.env.SWAGGER_API_PREFIX}/json`,
  });
}

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  app.setGlobalPrefix(process.env.GLOBAL_API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new HttpException(result[0].message, HttpStatus.BAD_REQUEST);
      },
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter),
    new PrismaClientValidationFilter(httpAdapter),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(new Reflector()),
  );

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // Swagger
  createSwagger(app);

  await app.listen(PORT);
}
bootstrap();
