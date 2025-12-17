import { Module, ValidationPipe } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/nexus"),

    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
