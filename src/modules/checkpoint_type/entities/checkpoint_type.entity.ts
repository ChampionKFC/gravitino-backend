import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class CheckpointType extends Model {
    @PrimaryKey
    @ApiProperty()
    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
    checkpoint_type_id: number;

    @ApiProperty({ description: 'Тип пункта пропуска' })
    @Column({ type: DataType.STRING, allowNull: false })
    checkpoint_type_name: string;
}
