import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator'

export class RoleResponse {
  @IsInt()
  @ApiProperty()
  role_id: number

  @IsString()
  @ApiProperty()
  role_name: string
}

export class ArrayRoleResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: RoleResponse, isArray: true })
  data: RoleResponse[]
}

export class StatusRoleResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: RoleResponse
}
