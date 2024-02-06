import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CheckpointTypeResponse {
    @IsInt()
    @ApiProperty()
    checkpoint_type_id: number;

    @IsString()
    @ApiProperty()
    checkpoint_type_name: string;
}

export class StatusCheckpointTypeResponse {
    @IsBoolean()
    @ApiProperty()
    status: boolean;

    @IsOptional()
    @ApiProperty({ required: false })
    data?: CheckpointTypeResponse;
}
