import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InternalServerErrorDto } from '@producerModule/http/rest/dto/response/internal-server-error-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Movie Awards')
    .setVersion('1.0')
    .setOpenAPIVersion('3.1.0')
    .setDescription('The Movie Awards API')
    .addServer('http://localhost:3000')
    .addGlobalResponse({ type: InternalServerErrorDto, status: 500 })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
