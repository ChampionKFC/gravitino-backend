import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional } from 'class-validator'

export class RolePermissionResponse {
  @IsInt()
  @ApiProperty()
  role_permission_id: number

  @IsInt()
  @ApiProperty()
  role_id?: number

  @IsInt()
  @ApiProperty()
  user_id?: number

  @IsInt()
  @ApiProperty()
  permission_id: number

  @IsBoolean()
  @ApiProperty()
  rights: boolean
}

export class ArrayRolePermissionResponse {
  @IsInt()
  @ApiProperty()
  count: number

  @IsArray()
  @ApiProperty({ required: false, type: RolePermissionResponse, isArray: true })
  data: RolePermissionResponse[]
}

export class StatusRolePermissionResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: RolePermissionResponse
}
