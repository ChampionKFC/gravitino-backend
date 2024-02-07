import { ApiProperty } from '@nestjs/swagger'
import { OrganizationTypeFilters, OrganizationTypeSorts } from 'src/modules/organization_type/dto'

export class CreateOrganizationDto {
  @ApiProperty({ default: 1 })
  organization_type_id: number

  @ApiProperty()
  full_name: string

  @ApiProperty()
  short_name: string

  @ApiProperty()
  phone: string

  @ApiProperty({ default: [] })
  property_values?: number[]
}

export class UpdateOrganizationDto {
  @ApiProperty({ default: 1 })
  organization_id: number

  @ApiProperty({ default: 1, required: false })
  organization_type_id?: number

  @ApiProperty({ required: false })
  full_name?: string

  @ApiProperty({ required: false })
  short_name?: string

  @ApiProperty({ required: false })
  phone?: string

  @ApiProperty({ default: [], required: false })
  property_values?: number[]
}

export class OrganizationSorts {
  @ApiProperty({ default: 'ASC', required: false })
  organization_id?: string

  @ApiProperty({ required: false })
  organization_type?: OrganizationTypeSorts

  @ApiProperty({ default: 'ASC', required: false })
  full_name?: string

  @ApiProperty({ default: 'ASC', required: false })
  short_name?: string

  @ApiProperty({ default: 'ASC', required: false })
  register_number?: string

  @ApiProperty({ default: 'ASC', required: false })
  phone?: string

  @ApiProperty({ default: 'ASC', required: false })
  email?: string
}

export class OrganizationFilters {
  @ApiProperty({ default: 1, required: false })
  organization_id?: number

  @ApiProperty({ required: false })
  organization_type?: OrganizationTypeFilters

  @ApiProperty({ required: false })
  full_name?: string

  @ApiProperty({ required: false })
  short_name?: string

  @ApiProperty({ required: false })
  register_number?: string

  @ApiProperty({ required: false })
  phone?: string

  @ApiProperty({ required: false })
  email?: string
}
