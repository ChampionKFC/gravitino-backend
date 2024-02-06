import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TaskResponse {
  @IsString()
  @ApiProperty()
  task_id: number;

  @IsString()
  @ApiProperty()
  task_name: string;

  @IsString()
  @ApiProperty({ required: false })
  task_description?: string;

  @IsString()
  @ApiProperty({ default: 1 })
  category_id: number;

  @IsString()
  @ApiProperty({ default: 1 })
  periodicity_id: number;

  @IsString()
  @ApiProperty()
  period_start: Date;

  @IsString()
  @ApiProperty()
  period_end: Date;
}

export class StatusTaskResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: TaskResponse;
}
