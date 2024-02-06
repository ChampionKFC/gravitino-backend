import { ApiProperty } from "@nestjs/swagger";

export class FilterOffset {
    @ApiProperty({ default: 50 })
    count?: number;

    @ApiProperty({ default: 1 })
    page?: number;
}