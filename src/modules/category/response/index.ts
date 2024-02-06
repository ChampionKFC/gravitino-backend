import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CategoryResponse {
  @IsInt()
  @ApiProperty()
  category_id: number;

  @IsString()
  @ApiProperty()
  category_name: string;
}

export class StatusCategoryResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: CategoryResponse;
}
