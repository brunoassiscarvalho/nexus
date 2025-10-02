import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FlowchartController } from "./flowchart.controller";
import { FlowchartService } from "./flowchart.service";
import { Flowchart, FlowchartSchema } from "./flowchart.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flowchart.name, schema: FlowchartSchema },
    ]),
  ],
  controllers: [FlowchartController],
  providers: [FlowchartService],
  exports: [FlowchartService],
})
export class FlowchartModule {}
