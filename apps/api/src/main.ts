import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow requests from the frontend during development. Override in production.
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle("Flowchart API")
    .setDescription("API for managing flowcharts")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3010);
}
bootstrap();
