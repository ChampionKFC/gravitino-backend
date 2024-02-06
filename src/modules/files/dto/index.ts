import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({ default: 1 })
  order_id: number;

  @ApiProperty()
  file_sku: string;

  @ApiProperty()
  file_alt: string;

  @ApiProperty({ default: 1 })
  file_type_id: number;
}
export class UpdateFileDto {
  @ApiProperty({ default: 1 })
  file_id: number;

  @ApiProperty({ default: 1, required: false })
  order_id?: number;

  @ApiProperty({ required: false })
  file_sku?: string;

  @ApiProperty({ required: false })
  file_alt?: string;

  @ApiProperty({ default: 1, required: false })
  file_type_id?: number;
}

export class UploadFileDto {
  @ApiProperty()
  object_uuid: string;

  @ApiProperty()
  directory: string;
}
