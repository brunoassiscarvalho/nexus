import { Module } from '@nestjs/common';
import { CanvasGateway } from './canvas.gateway';
import { CanvasService } from './canvas.service';

@Module({
  providers: [CanvasGateway, CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
