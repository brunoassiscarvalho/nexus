import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";
import { FlowchartService } from "./flowchart.service";
import { ExportFlowchartDto } from "./dto/export-flowchart.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("flowcharts")
@Controller("flowcharts")
@UseGuards(JwtAuthGuard)
export class FlowchartController {
  constructor(private readonly flowchartService: FlowchartService) {}

  @Post(":userId")
  @ApiOperation({ summary: "Export flowchart data for a user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({ type: ExportFlowchartDto })
  @ApiResponse({ status: 201, description: "Flowchart exported successfully" })
  async export(
    @Param("userId") userId: string,
    @Body() data: ExportFlowchartDto
  ) {
    return this.flowchartService.exportFlowchart(userId, data);
  }

  @Get(":userId")
  @ApiOperation({ summary: "Import flowchart data for a user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 200, description: "Flowchart data retrieved" })
  async import(@Param("userId") userId: string) {
    const flowchart = await this.flowchartService.importFlowchart(userId);
    if (!flowchart) {
      return { cards: [], connections: [], version: "1.0" };
    }
    return {
      cards: flowchart.cards,
      connections: flowchart.connections,
      version: flowchart.version,
    };
  }
}
