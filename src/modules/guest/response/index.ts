import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class GuestResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  guest_id: number

  @IsString()
  @ApiProperty()
  guest_name: string

  @IsString()
  @ApiProperty()
  guest_email: string

  @IsString()
  @ApiProperty()
  guest_phone: string
}

export class StatusGuestResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean

  @IsOptional()
  @ApiProperty({ required: false })
  data?: GuestResponse
}
