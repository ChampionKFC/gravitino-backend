import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreateOrganizationTypeDto {
  @ApiProperty()
  organization_type_name: string
}

export class UpdateOrganizationTypeDto {
  @ApiProperty({ default: 1 })
  organization_type_id: number

  @ApiProperty({ required: false })
  organization_type_name?: string
}

export class OrganizationTypeSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  organization_type_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  organization_type_name?: string
}

export class OrganizationTypeFilters {
  @ApiProperty({ default: 1, required: false })
  organization_type_id?: number

  @ApiProperty({ required: false })
  organization_type_name?: string
}
