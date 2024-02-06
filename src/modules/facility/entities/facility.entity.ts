import { ApiProperty } from "@nestjs/swagger";
import { NonAttribute } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Checkpoint } from "src/modules/checkpoint/entities/checkpoint.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";

@Table
export class Facility extends Model {
    @PrimaryKey
    @ApiProperty()
    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true, })
    facility_id: number;

    @ApiProperty({ example: 'Объект обслуживания №1', description: 'Название объекта обслуживания' })
    @Column({ type: DataType.STRING(30), allowNull: false, })
    facility_name: string;

    @ForeignKey(() => Organization)
    @Column({ type: DataType.INTEGER, allowNull: false, })
    organization_id: number;

    @ApiProperty({
        type: () => Organization,
        description: 'Организация'
    })
    @BelongsTo(() => Organization)
    organization: Organization;

    @ForeignKey(() => Checkpoint)
    @Column({ type: DataType.INTEGER, allowNull: false, })
    checkpoint_id: number;

    @ApiProperty({
        type: () => Checkpoint,
        description: 'Пункт пропуска'
    })
    @BelongsTo(() => Checkpoint)
    checkpoint: Checkpoint;

    // @ApiProperty({ example: 'улица У.', description: 'Местоположение пункта пропуска' })
    // @Column({ type: DataType.STRING, allowNull: false, })
    // location: string;

    @HasMany(() => Order, 'facility_id')
    orders: NonAttribute<Order[]>;
}