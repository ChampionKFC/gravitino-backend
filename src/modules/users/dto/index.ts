import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ required: false })
  last_name: string

  @ApiProperty({ required: false })
  first_name: string

  @ApiProperty({ required: false })
  patronymic?: string

  @ApiProperty({ required: false })
  phone: string

  person_id: number

  @ApiProperty({ default: 1 })
  role_id: number

  @ApiProperty({ default: 1, required: false })
  group_id?: number

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}

export class UpdateUserDto {
  @ApiProperty({ default: 1 })
  user_id: number

  @ApiProperty({ required: false })
  last_name?: string

  @ApiProperty({ required: false })
  first_name?: string

  @ApiProperty({ required: false })
  patronymic?: string

  @ApiProperty({ required: false })
  phone?: string

  person_id?: number

  @ApiProperty({ default: 1, required: false })
  role_id?: number

  @ApiProperty({ default: 1, required: false })
  group_id?: number

  @ApiProperty({ required: false })
  email?: string

  @ApiProperty({ required: false })
  password?: string

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}

export class UpdateUserStatusDto {
  @ApiProperty({ default: 1 })
  user_id: number

  @ApiProperty({ default: true })
  is_active: boolean
}

export class CreateUserOrganizationDto {
  @ApiProperty({ required: false })
  organization_type_id: number

  @ApiProperty({ required: false })
  full_name: string

  @ApiProperty({ required: false })
  short_name: string

  @ApiProperty({ required: false })
  phone: string

  organization_id: number

  @ApiProperty({ default: 1 })
  role_id: number

  @ApiProperty({ default: 1, required: false })
  group_id?: number

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}

export class UpdateUserOrganizationDto {
  @ApiProperty({ default: 1 })
  user_id: number

  @ApiProperty({ required: false })
  organization_type_id?: number

  @ApiProperty({ required: false })
  full_name?: string

  @ApiProperty({ required: false })
  short_name?: string

  @ApiProperty({ required: false })
  phone?: string

  organization_id?: number

  @ApiProperty({ default: 1, required: false })
  role_id?: number

  @ApiProperty({ default: 1, required: false })
  group_id?: number

  @ApiProperty({ required: false })
  email?: string

  @ApiProperty({ required: false })
  password?: string

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}
