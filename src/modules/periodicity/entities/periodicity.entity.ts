import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class Periodicity extends Model {
    @PrimaryKey
    @ApiProperty()
    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
    periodicity_id: number;

    @ApiProperty()
    @Column({ type: DataType.STRING(50), allowNull: false })
    periodicity_name: string;
}
