import { ApiProperty } from "@nestjs/swagger";

export class CreateCheckpointTypeDto {
    @ApiProperty()
    checkpoint_type_name: string;
}

export class UpdateCheckpointTypeDto {
    @ApiProperty({ default: 1 })
    checkpoint_type_id: number;

    @ApiProperty({ required: false })
    checkpoint_type_name?: string;
}

export class CheckpointTypeSorts {
    @ApiProperty({ default: 'ASC', required: false })
    checkpoint_type_id?: string;

    @ApiProperty({ default: 'ASC', required: false })
    checkpoint_type_name?: string;
}

export class CheckpointTypeFilters {
    @ApiProperty({ default: 1, required: false })
    checkpoint_type_id?: number;

    @ApiProperty({ required: false })
    checkpoint_type_name?: string;
}
