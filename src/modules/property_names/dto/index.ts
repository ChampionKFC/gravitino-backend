import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePropertyNameDto {
  @IsString()
  @ApiProperty()
  property_name: string;

  @IsString()
  @ApiProperty()
  entity_name: string;
}

export class UpdatePropertyNameDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 1 })
  property_name_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  property_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  entity_name?: string;
}
