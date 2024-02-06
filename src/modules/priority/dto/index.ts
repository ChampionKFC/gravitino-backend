import { ApiProperty } from '@nestjs/swagger';

export class CreatePriorityDto {
  @ApiProperty()
  priority_name: string;
}

export class UpdatePriorityDto {
  @ApiProperty({ default: 1 })
  priority_id: number;

  @ApiProperty({ required: false })
  priority_name?: string;
}

export class OrderPrioritySorts {
  @ApiProperty({ default: 'ASC', required: false })
  priority_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  priority_name?: string;
}

export class OrderPriorityFilters {
  @ApiProperty({ default: 1, required: false })
  priority_id?: number;

  @ApiProperty({ required: false })
  priority_name?: string;
}