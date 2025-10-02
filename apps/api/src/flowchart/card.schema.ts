import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @ApiProperty({ description: "Unique identifier for the card" })
  @Prop({ required: true })
  id: string;

  @ApiProperty({ description: "Type of the card" })
  @Prop({ required: true })
  type: string;

  @ApiProperty({ description: "X coordinate position" })
  @Prop({ required: true })
  x: number;

  @ApiProperty({ description: "Y coordinate position" })
  @Prop({ required: true })
  y: number;

  @ApiProperty({ description: "Label text for the card" })
  @Prop({ required: true })
  label: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
