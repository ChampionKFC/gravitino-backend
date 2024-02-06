import { ApiProperty } from '@nestjs/swagger';

export class CreateFileTypeDto {
  @ApiProperty()
  file_type_name: string;

  @ApiProperty()
  file_extension: string;
}

export class UpdateFileTypeDto {
  @ApiProperty({ default: 1 })
  file_type_id?: number;

  @ApiProperty({ required: false })
  file_type_name?: string;

  @ApiProperty({ required: false })
  file_extension?: string;
}
