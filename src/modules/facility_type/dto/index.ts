import { ApiProperty } from '@nestjs/swagger'

export class CreateFacilityTypeDto {
  @ApiProperty()
  facility_type_name: string
}
export class UpdateFacilityTypeDto {
  @ApiProperty()
  facility_type_id: number

  @ApiProperty({ required: false })
  facility_type_name?: string
}
