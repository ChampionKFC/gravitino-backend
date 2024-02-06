import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class GroupResponse {
  @IsInt()
  @ApiProperty()
  group_id: number;

  @IsString()
  @ApiProperty()
  group_name: string;

  @IsInt()
  @ApiProperty({ required: false })
  branch_id?: number;
}

export class StatusGroupResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: GroupResponse;
}
