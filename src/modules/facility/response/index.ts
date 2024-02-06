import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class FacilityResponse {
    @IsInt()
    @ApiProperty({ default: 1 })
    facility_id: number;

    @IsString()
    @ApiProperty()
    facility_name: string;

    @IsInt()
    @ApiProperty({ default: 1 })
    organization_id: number;

    @IsInt()
    @ApiProperty({ default: 1 })
    checkpoint_id: number;
}

export class StatusFacilityResponse {
    @IsBoolean()
    @ApiProperty()
    status: boolean;

    @IsOptional()
    @ApiProperty({ required: false })
    data?: FacilityResponse;
}