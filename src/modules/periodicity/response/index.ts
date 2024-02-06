import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PeriodicityResponse {
    @IsString()
    @ApiProperty()
    periodicity_id: number;

    @IsString()
    @ApiProperty()
    periodicity_name: string;
}

export class StatusPeriodicityResponse {
    @IsBoolean()
    @ApiProperty()
    status: boolean;

    @IsOptional()
    @ApiProperty({ required: false })
    data?: PeriodicityResponse;
}
