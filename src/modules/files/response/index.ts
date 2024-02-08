import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional } from 'class-validator'

export class FileResponse {
  @ApiProperty({ default: 1 })
  file_id: number

  @ApiProperty({ default: 1 })
  order_id: number

  @ApiProperty()
  file_sku: string

  @ApiProperty()
  file_alt: string

  @ApiProperty()
  file_type_id: number
}

export class ArrayFileResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: FileResponse, isArray: true })
  data: FileResponse[]
}

export class StatusFileResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: FileResponse
}
