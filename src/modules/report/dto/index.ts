import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateReportDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ default: 1 })
  report_user_id: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  file_sku: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  file_alt: string

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ default: 1 })
  file_type_id: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  report_json: string
}

export class UpdateReportDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ default: 1 })
  report_id?: number

  @IsOptional()
  @IsInt()
  @ApiProperty({ default: 1 })
  report_user_id?: number

  @IsOptional()
  @IsString()
  @ApiProperty()
  file_sku?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  file_alt?: string

  @IsOptional()
  @IsInt()
  @ApiProperty({ default: 1 })
  file_type_id?: number

  @IsOptional()
  @ApiProperty()
  report_json?: string
}

export class ReportDto {
  @ApiProperty()
  period_start: Date

  @ApiProperty()
  period_end: Date
}
