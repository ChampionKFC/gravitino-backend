import { ApiProperty } from "@nestjs/swagger";

export class CreatePeriodicityDto {
    @ApiProperty()
    periodicity_name: string;
}

export class UpdatePeriodicityDto {
    @ApiProperty()
    periodicity_id: number;

    @ApiProperty({ required: false })
    periodicity_name?: string;
}

export class PeriodicitySorts {
    @ApiProperty({ default: 'ASC', required: false })
    periodicity_id?: string;

    @ApiProperty({ default: 'ASC', required: false })
    periodicity_name?: string;
}

export class PeriodicityFilters {
    @ApiProperty({ required: false })
    periodicity_id?: number;

    @ApiProperty({ required: false })
    periodicity_name?: string;
}
