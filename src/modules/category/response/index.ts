import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CategoryResponse {
  @IsInt()
  @ApiProperty()
  category_id: number

  @IsString()
  @ApiProperty()
  category_name: string
}

export class ArrayCategoryResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: CategoryResponse, isArray: true })
  data: CategoryResponse[]
}

export class StatusCategoryResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: CategoryResponse
}
