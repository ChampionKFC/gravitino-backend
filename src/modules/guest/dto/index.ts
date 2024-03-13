import { ApiProperty } from '@nestjs/swagger'

export class CreateGuestDto {
  @ApiProperty()
  guest_name: string

  @ApiProperty()
  guest_email: string

  @ApiProperty()
  guest_phone: string
}
