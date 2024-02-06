import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty()
  last_name: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty({ required: false })
  patronymic?: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  property_values?: number[];
}

export class UpdatePersonDto {
  @ApiProperty()
  person_id: number;

  @ApiProperty({ required: false })
  last_name?: string;

  @ApiProperty({ required: false })
  first_name?: string;

  @ApiProperty({ required: false })
  patronymic?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  property_values?: number[];
}

export class PersonSorts {
  @ApiProperty({ default: 'ASC', required: false })
  last_name?: string;

  @ApiProperty({ default: 'ASC', required: false })
  first_name?: string;

  @ApiProperty({ default: 'ASC', required: false })
  patronymic?: string;

  @ApiProperty({ default: 'ASC', required: false })
  phone?: string;
}

export class PersonFilters {
  @ApiProperty({ required: false })
  person_id?: number;

  @ApiProperty({ required: false })
  last_name?: string;

  @ApiProperty({ required: false })
  first_name?: string;

  @ApiProperty({ required: false })
  patronymic?: string;

  @ApiProperty({ required: false })
  phone?: string;
}