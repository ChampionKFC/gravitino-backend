import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreateBranchDto {
  @ApiProperty()
  branch_name: string

  @ApiProperty()
  branch_address: string
}

export class UpdateBranchDto {
  @ApiProperty({ default: 1 })
  branch_id: number

  @ApiProperty({ required: false })
  branch_name?: string

  @ApiProperty({ required: false })
  branch_address?: string
}

export class BranchSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  branch_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  branch_name?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  branch_address?: string
}

export class BranchFilters {
  @ApiProperty({ default: 1, required: false })
  branch_id?: number

  @ApiProperty({ required: false })
  branch_name?: string

  @ApiProperty({ required: false })
  branch_address?: string
}
