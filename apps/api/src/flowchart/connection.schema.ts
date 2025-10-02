import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type ConnectionDocument = Connection & Document;

@Schema()
export class Connection {
  @ApiProperty({ description: "Unique identifier for the connection" })
  @Prop({ required: true })
  id: string;

  @ApiProperty({ description: "Source card ID" })
  @Prop({ required: true })
  from: string;

  @ApiProperty({ description: "Target card ID" })
  @Prop({ required: true })
  to: string;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
