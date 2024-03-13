import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './modules/app/app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})
  const configService = app.get(ConfigService)
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://localhost:3001',
      'http://localhost:3000',
      'http://localhost',
      'https://localhost',
      'http://31.172.73.217',
      'https://31.172.73.217',
      'http://front.production.gravitino.ru',
      'http://front.dev.gravitino.ru',
      'http://devops.gravitino.ru',
      'http://frontend.devops-prod.gravitino.ru',
      'http://frontend.devops-dev.gravitino.ru',
      'http://frontend.devops-prod.gravitino.ru',
      'https://frontend.devops-prod.gravitino.ru',
      'https://frontend.devops-dev.gravitino.ru',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
  const config = new DocumentBuilder()
    .setTitle('GRAVITINO ASU API')
    .setDescription('The GRAVITINO ASU API!')
    .setVersion('1.0')
    //.addTag('GRAVITINO ASU')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build()
  const port = configService.get('port')
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
    },
    customSiteTitle: 'GRAVITINO ASU API',
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port)
}
bootstrap()
