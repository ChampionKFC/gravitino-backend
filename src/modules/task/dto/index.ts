import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'
import { CategoryFilters, CategorySorts } from 'src/modules/category/dto'
import { PeriodicityFilters, PeriodicitySorts } from 'src/modules/periodicity/dto'

export class CreateTaskDto {
  @ApiProperty({ default: 1 })
  task_name: string

  @ApiProperty({ required: false })
  task_description?: string

  @ApiProperty({ default: 1 })
  category_id: number

  @ApiProperty({ default: 1 })
  periodicity_id: number

  @ApiProperty({ default: [], required: false })
  branch_ids?: number[]

  @ApiProperty({ default: [], required: false })
  checkpoint_ids?: number[]

  @ApiProperty({ default: [], required: false })
  facility_ids?: number[]

  @ApiProperty({ default: [] })
  executor_ids: number[]

  @ApiProperty({ default: 1 })
  priority_id: number

  @ApiProperty()
  period_start: Date

  @ApiProperty()
  period_end: Date
}

export class UpdateTaskDto {
  @ApiProperty({ default: 1 })
  task_id: number

  @ApiProperty({ default: 1, required: false })
  task_name?: string

  @ApiProperty({ required: false })
  task_description?: string

  @ApiProperty({ default: 1, required: false })
  category_id?: number

  @ApiProperty({ default: 1, required: false })
  periodicity_id?: number

  @ApiProperty({ required: false })
  period_start?: Date

  @ApiProperty({ required: false })
  period_end?: Date
}

export class TaskSorts {
  @ApiProperty({ default: AppStrings.ASC, required: false })
  task_id?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  task_name?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  task_description?: string

  @ApiProperty({ required: false })
  category?: CategorySorts

  @ApiProperty({ required: false })
  periodicity?: PeriodicitySorts

  @ApiProperty({ default: AppStrings.ASC, required: false })
  period_start?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  period_end?: string
}

export class TaskFilters {
  @ApiProperty({ default: 1, required: false })
  task_id?: number

  @ApiProperty({ default: 1, required: false })
  task_name?: string

  @ApiProperty({ required: false })
  task_description?: string

  @ApiProperty({ required: false })
  category?: CategoryFilters

  @ApiProperty({ required: false })
  periodicity?: PeriodicityFilters

  @ApiProperty({ required: false })
  period_start?: Date

  @ApiProperty({ required: false })
  period_end?: Date
}

export class TaskStartEndDatetime {
  planned_datetime: Date

  task_end_datetime: Date
}
