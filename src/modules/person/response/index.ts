import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class PersonResponse {
  @IsInt()
  @ApiProperty()
  person_id: number;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  patronymic?: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  property_values?: number[];
}

export class StatusPersonResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: PersonResponse;
}
