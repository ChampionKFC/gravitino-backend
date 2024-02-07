import { ApiProperty } from '@nestjs/swagger'
import { FilterOffset } from 'src/common/classes/filter_offset'
import { GroupSorts, GroupFilters } from 'src/modules/group/dto'
import { OrganizationSorts, OrganizationFilters } from 'src/modules/organization/dto'
import { PersonSorts, PersonFilters } from 'src/modules/person/dto'
import { RoleSorts, RoleFilters } from 'src/modules/roles/dto'

export class UserSorts {
  @ApiProperty({ default: 'ASC', required: false })
  user_id?: string

  @ApiProperty({ default: 'ASC', required: false })
  email?: string

  @ApiProperty({ default: 'ASC', required: false })
  is_active?: string

  @ApiProperty({ required: false })
  person?: PersonSorts

  @ApiProperty({ required: false })
  role?: RoleSorts

  @ApiProperty({ required: false })
  group?: GroupSorts

  @ApiProperty({ required: false })
  organization?: OrganizationSorts
}

export class UserFilters {
  @ApiProperty({ required: false })
  user_id?: number

  @ApiProperty({ required: false })
  person?: PersonFilters

  @ApiProperty({ required: false })
  role?: RoleFilters

  @ApiProperty({ required: false })
  organization?: OrganizationFilters

  @ApiProperty({ required: false })
  group?: GroupFilters

  @ApiProperty({ default: true, required: false })
  is_active?: boolean

  @ApiProperty({ required: false })
  email?: string
}

export class UserFilter {
  @ApiProperty({ required: false })
  offset?: FilterOffset

  @ApiProperty({ required: false })
  filter?: UserFilters

  @ApiProperty({ required: false })
  sorts?: UserSorts
}
