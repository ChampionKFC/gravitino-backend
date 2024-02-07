import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreateRoleDto {
  @ApiProperty()
  role_name: string
}

export class UpdateRoleDto {
  @ApiProperty({ default: 1 })
  role_id: number

  @ApiProperty({ required: false })
  role_name?: string
}

export class RoleSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  role_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  role_name?: string
}

export class RoleFilters {
  @ApiProperty({ default: 1, required: false })
  role_id?: number

  @ApiProperty({ required: false })
  role_name?: string
}
