import { ApiProperty } from '@nestjs/swagger'
import { NonAttribute } from 'sequelize'
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { AppStrings } from 'src/common/constants/strings'
import { Organization } from 'src/modules/organization/entities/organization.entity'

@Table
export class OrganizationType extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true })
  organization_type_id: number

  @ApiProperty({
    example: AppStrings.ORGANIZATION_TYPE_NAME_EXAMPLE,
    description: AppStrings.ORGANIZATION_TYPE_NAME_DESCRIPTION,
  })
  @Column({ type: DataType.STRING(100), allowNull: false })
  organization_type_name: string

  @HasMany(() => Organization, OrganizationType.primaryKeyAttribute)
  organizations: NonAttribute<Organization[]>
}
