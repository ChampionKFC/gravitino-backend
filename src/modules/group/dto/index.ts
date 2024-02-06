import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { BranchFilters } from 'src/modules/branch/dto';
import { CheckpointFilters } from 'src/modules/checkpoint/dto';

export class CreateGroupDto {
  @IsString()
  @ApiProperty()
  group_name: string;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  branch_id?: number;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  checkpoint_id?: number;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  facility_id?: number;
}

export class UpdateGroupDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 1 })
  group_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  group_name?: string;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  branch_id?: number;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  checkpoint_id?: number;

  @IsInt()
  @ApiProperty({ default: 1, required: false })
  facility_id?: number;
}

export class GroupSorts {
  @ApiProperty({ default: 'ASC', required: false })
  group_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  group_name?: string;

  @ApiProperty({ default: 'ASC', required: false })
  branch_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  checkpoint_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  facility_id?: string;
}

export class GroupFilters {
  @ApiProperty({ default: 1, required: false })
  group_id?: number;

  @ApiProperty({ required: false })
  group_name?: string;

  @ApiProperty({ default: 1, required: false })
  branch_id?: BranchFilters;

  @ApiProperty({ default: 1, required: false })
  checkpoint_id?: CheckpointFilters;

  @ApiProperty({ default: 1, required: false })
  facility_id?: number;
}
