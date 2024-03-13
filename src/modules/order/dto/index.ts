import { ApiProperty } from '@nestjs/swagger'
import { AppStrings } from 'src/common/constants/strings'
import { FacilityFilters, FacilitySorts } from 'src/modules/facility/dto'
import { OrderStatusFilters, OrderStatusSorts } from 'src/modules/order_status/dto'
import { OrganizationFilters, OrganizationSorts } from 'src/modules/organization/dto'
import { OrderPriorityFilters, OrderPrioritySorts } from 'src/modules/priority/dto'
import { TaskFilters, TaskSorts } from 'src/modules/task/dto'
import { UserSorts, UserFilters } from 'src/modules/users/filters'

export class CreateOrderDto {
  @ApiProperty({ default: 1 })
  task_id?: number

  @ApiProperty({ required: false })
  order_name?: string

  @ApiProperty({ required: false })
  order_description?: string

  @ApiProperty({ default: 1 })
  facility_id: number

  @ApiProperty({ default: 1 })
  executor_id: number

  creator_id: number

  order_status_id: number

  @ApiProperty()
  planned_datetime: Date

  @ApiProperty()
  task_end_datetime: Date

  @ApiProperty({ default: 1 })
  priority_id: number

  @ApiProperty({ required: false, default: [] })
  property_values?: number[]
}

export class BulkCreateOrderDto {
  @ApiProperty()
  order_name: string

  @ApiProperty()
  order_description: string

  @ApiProperty({ default: [], required: false })
  branch_ids?: number[]

  @ApiProperty({ default: [], required: false })
  checkpoint_ids?: number[]

  @ApiProperty({ default: [], required: false })
  facility_type_ids?: number[]

  @ApiProperty({ default: [], required: false })
  facility_ids?: number[]

  @ApiProperty({ default: [] })
  executor_ids: number[]

  @ApiProperty()
  planned_datetime: Date

  @ApiProperty()
  task_end_datetime: Date

  @ApiProperty({ default: 1 })
  priority_id: number

  @ApiProperty({ required: false, default: [] })
  property_values?: number[]
}

export class CreateGuestOrderDto {
  @ApiProperty({ required: false })
  guest_name?: string

  @ApiProperty({ required: false })
  guest_email?: string

  @ApiProperty({ required: false })
  guest_phone?: string

  @ApiProperty({ required: false })
  order_name?: string

  @ApiProperty({ required: false })
  order_description?: string

  @ApiProperty({ default: 1 })
  facility_id: number
}

export class UpdateOrderDto {
  @ApiProperty({ default: 1 })
  order_id: number

  @ApiProperty({ default: 1, required: false })
  task_id?: number

  @ApiProperty({ required: false })
  order_name?: string

  @ApiProperty({ required: false })
  order_description?: string

  @ApiProperty({ default: 1, required: false })
  facility_id?: number

  @ApiProperty({ default: 1, required: false })
  executor_id?: number

  @ApiProperty({ default: 1, required: false })
  completed_by?: number // User ID

  @ApiProperty({ default: 1, required: false })
  creator_id?: number

  @ApiProperty({ default: 1, required: false })
  order_status_id?: number

  @ApiProperty({ required: false })
  planned_datetime?: Date

  @ApiProperty({ required: false })
  task_end_datetime?: Date

  @ApiProperty({ default: 1, required: false })
  priority_id?: number

  @ApiProperty({ required: false, default: [] })
  property_values?: number[]
}

export class UpdateStatusDto {
  @ApiProperty({ default: 1 })
  order_id: number

  @ApiProperty({ default: 1, required: false })
  order_status_id?: number
}

export class UpdateExecutorDto {
  @ApiProperty({ default: 1 })
  order_id: number

  @ApiProperty({ default: 1 })
  executor_id: number
}

export class OrderSorts {
  @ApiProperty({ default: AppStrings.ASC })
  order_id: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  order_name?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  order_description?: string

  @ApiProperty({ required: false })
  completed_by?: UserSorts

  @ApiProperty({ required: false })
  creator?: UserSorts

  @ApiProperty({ default: AppStrings.ASC, required: false })
  planned_datetime?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  task_end_datetime?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  ended_at_datetime?: string

  @ApiProperty({ default: AppStrings.ASC, required: false })
  closed_at_datetime?: string

  @ApiProperty({ required: false })
  facility?: FacilitySorts

  @ApiProperty({ required: false })
  task?: TaskSorts

  @ApiProperty({ required: false })
  executor?: OrganizationSorts

  @ApiProperty({ required: false })
  priority?: OrderPrioritySorts

  @ApiProperty({ required: false })
  order_status?: OrderStatusSorts
}

export class OrderFilters {
  @ApiProperty({ default: 1, required: false })
  order_id?: number

  @ApiProperty({ required: false })
  order_name?: string

  @ApiProperty({ required: false })
  order_description?: string

  @ApiProperty({ required: false })
  completed_by?: UserFilters // User ID

  @ApiProperty({ required: false })
  creator?: UserFilters

  @ApiProperty({ required: false })
  planned_datetime?: Date

  @ApiProperty({ required: false })
  task_end_datetime?: Date

  @ApiProperty({ required: false })
  ended_at_datetime?: Date

  @ApiProperty({ required: false })
  closed_at_datetime?: Date

  @ApiProperty({ required: false })
  facility?: FacilityFilters

  @ApiProperty({ required: false })
  task?: TaskFilters

  @ApiProperty({ required: false })
  executor?: OrganizationFilters

  @ApiProperty({ required: false })
  priority?: OrderPriorityFilters

  @ApiProperty({
    required: false,
    default: [{ order_status_id: 1, order_status_name: AppStrings.CREATED }],
  })
  order_status?: OrderStatusFilters[]
}
