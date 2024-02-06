import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  category_name: string;
}

export class UpdateCategoryDto {
  @ApiProperty()
  category_id: number;

  @ApiProperty({ required: false })
  category_name?: string;
}

export class CategorySorts {
  @ApiProperty({ default: 'ASC', required: false })
  category_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  category_name?: string;
}

export class CategoryFilters {
  @ApiProperty({ default: 1, required: false })
  category_id?: number;

  @ApiProperty({ required: false })
  category_name?: string;
}