import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePropertyValueDto {
  @IsInt()
  @ApiProperty({ default: 1 })
  property_name_id: number;

  @IsString()
  @ApiProperty()
  property_value: string;
}

export class UpdatePropertyValueDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 1 })
  property_value_id: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 1, required: false })
  property_name_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  property_value?: string;
}
