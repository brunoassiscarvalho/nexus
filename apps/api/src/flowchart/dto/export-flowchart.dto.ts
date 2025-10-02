import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class CardDto {
  @ApiProperty({ description: "Unique identifier for the card" })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "Type of the card" })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: "X coordinate position" })
  @IsNotEmpty()
  x: number;

  @ApiProperty({ description: "Y coordinate position" })
  @IsNotEmpty()
  y: number;

  @ApiProperty({ description: "Label text for the card" })
  @IsString()
  @IsNotEmpty()
  label: string;
}

class ConnectionDto {
  @ApiProperty({ description: "Unique identifier for the connection" })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "Source card ID" })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ description: "Target card ID" })
  @IsString()
  @IsNotEmpty()
  to: string;
}

export class ExportFlowchartDto {
  @ApiProperty({
    description: "Array of cards in the flowchart",
    type: [CardDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards: CardDto[];

  @ApiProperty({
    description: "Array of connections between cards",
    type: [ConnectionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConnectionDto)
  connections: ConnectionDto[];

  @ApiProperty({ description: "Version of the flowchart" })
  @IsString()
  @IsNotEmpty()
  version: string;
}
