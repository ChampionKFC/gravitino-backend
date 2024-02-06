import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class BranchResponse {
  @IsInt()
  @ApiProperty({ default: 1 })
  branch_id: number;

  @IsString()
  @ApiProperty()
  branch_name: string;

  @IsString()
  @ApiProperty()
  branch_address: string;
}

export class StatusBranchResponse {
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  data?: BranchResponse;
}
