import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Card } from "./card.schema";
import { Connection } from "./connection.schema";

export type FlowchartDocument = Flowchart & Document;

@Schema({ timestamps: true })
export class Flowchart {
  @ApiProperty({ description: "User ID associated with the flowchart" })
  @Prop({ required: true, unique: true })
  userId: string;

  @ApiProperty({ description: "Array of cards in the flowchart", type: [Card] })
  @Prop({ type: [Object], required: true })
  cards: Card[];

  @ApiProperty({
    description: "Array of connections between cards",
    type: [Connection],
  })
  @Prop({ type: [Object], required: true })
  connections: Connection[];

  @ApiProperty({ description: "Version of the flowchart" })
  @Prop({ required: true })
  version: string;
}

export const FlowchartSchema = SchemaFactory.createForClass(Flowchart);
