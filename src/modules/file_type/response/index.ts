import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class FileTypeResponse {
  @IsInt()
  @ApiProperty()
  file_type_id: number

  @IsString()
  @ApiProperty()
  file_type_name: string

  @IsString()
  @ApiProperty()
  file_extension: string
}

export class ArrayFileTypeResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: FileTypeResponse, isArray: true })
  data: FileTypeResponse[]
}

export class StatusFileTypeResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: FileTypeResponse
}
