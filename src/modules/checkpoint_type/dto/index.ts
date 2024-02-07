import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'

export class CreateCheckpointTypeDto {
  @ApiProperty()
  checkpoint_type_name: string
}

export class UpdateCheckpointTypeDto {
  @ApiProperty({ default: 1 })
  checkpoint_type_id: number

  @ApiProperty({ required: false })
  checkpoint_type_name?: string
}

export class CheckpointTypeSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  checkpoint_type_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  checkpoint_type_name?: string
}

export class CheckpointTypeFilters {
  @ApiProperty({ default: 1, required: false })
  checkpoint_type_id?: number

  @ApiProperty({ required: false })
  checkpoint_type_name?: string
}
