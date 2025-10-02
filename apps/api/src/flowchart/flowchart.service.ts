import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Flowchart, FlowchartDocument } from "./flowchart.schema";
import { ExportFlowchartDto } from "./dto/export-flowchart.dto";

@Injectable()
export class FlowchartService {
  constructor(
    @InjectModel(Flowchart.name)
    private flowchartModel: Model<FlowchartDocument>
  ) {}

  async exportFlowchart(
    userId: string,
    data: ExportFlowchartDto
  ): Promise<Flowchart> {
    const flowchart = await this.flowchartModel.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { upsert: true, new: true }
    );
    return flowchart;
  }

  async importFlowchart(userId: string): Promise<Flowchart | null> {
    return this.flowchartModel.findOne({ userId });
  }
}
