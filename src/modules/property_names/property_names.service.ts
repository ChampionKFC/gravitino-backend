import { Injectable } from '@nestjs/common'
import { CreatePropertyDto, CreatePropertyNameDto, UpdatePropertyDto } from './dto'
import { PropertyName } from './entities/property_name.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayPropertyNameResponse, StatusPropertyNameResponse } from './response'
import { AppStrings } from 'src/common/constants/strings'
import { Sequelize } from 'sequelize-typescript'
import { PropertyValuesService } from '../property_values/property_values.service'
import { PropertyValue } from '../property_values/entities/property_value.entity'
import { CreatePropertyValueDto } from '../property_values/dto'

@Injectable()
export class PropertyNamesService {
  constructor(
    @InjectModel(PropertyName) private propertyNameRepository: typeof PropertyName,
    @InjectModel(PropertyValue) private propertyValueRepository: typeof PropertyValue,
    private readonly historyService: TransactionHistoryService,
    private readonly propertyValuesService: PropertyValuesService,
    private readonly sequelize: Sequelize,
  ) {}

  async bulkCreate(createPropertiesDto: CreatePropertyDto, user_id: number): Promise<StatusPropertyNameResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      const newPropertyName = await this.propertyNameRepository.create(
        {
          property_name: createPropertiesDto.property_name,
          entity_name: createPropertiesDto.entity_name,
        },
        { transaction },
      )

      for (let index = 0; index < createPropertiesDto.property_values.length; index++) {
        const value = createPropertiesDto.property_values[index]

        const propertyValue = new CreatePropertyValueDto()
        propertyValue.property_name_id = newPropertyName.property_name_id
        propertyValue.property_value = value

        await this.propertyValuesService.create(propertyValue, user_id, transaction)
      }

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PROPERTY_CREATED}${newPropertyName.property_name_id}`,
      }
      await this.historyService.create(historyDto, transaction)

      transaction.commit()
      return { status: true, data: newPropertyName }
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }

  async create(createPropertyNameDto: CreatePropertyNameDto, user_id: number): Promise<StatusPropertyNameResponse> {
    try {
      const newPropertyName = await this.propertyNameRepository.create({
        ...createPropertyNameDto,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PROPERTY_NAME_CREATED}${newPropertyName.property_name_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newPropertyName }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(entity: string): Promise<ArrayPropertyNameResponse> {
    try {
      const result = await this.propertyNameRepository.findAll({ include: [PropertyValue], where: { entity_name: entity } })
      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(property_name_id: number) {
    try {
      const foundPropertyName = await this.propertyNameRepository.findOne({
        where: { property_name_id },
      })

      if (foundPropertyName) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatePropertyDto: UpdatePropertyDto, user_id: number): Promise<StatusPropertyNameResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      const updateProperty = await this.propertyNameRepository.update(
        { ...updatePropertyDto },
        { where: { property_name_id: updatePropertyDto.property_name_id }, transaction },
      )

      if (updateProperty) {
        await this.propertyValueRepository.destroy({ where: { property_name_id: updatePropertyDto.property_name_id }, transaction })

        for (let index = 0; index < updatePropertyDto.property_values.length; index++) {
          const value = updatePropertyDto.property_values[index]

          const propertyValue = new CreatePropertyValueDto()
          propertyValue.property_name_id = updatePropertyDto.property_name_id
          propertyValue.property_value = value

          await this.propertyValuesService.create(propertyValue, user_id, transaction)
        }

        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PROPERTY_UPDATED}${updatePropertyDto.property_name_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        transaction.commit()
        return { status: false }
      } else {
        transaction.rollback()
        return { status: true }
      }
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }

  async remove(property_name_id: number, user_id: number) {
    const deleteProperty = await this.propertyNameRepository.destroy({
      where: { property_name_id },
    })

    if (deleteProperty) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PROPERTY_DELETED}${property_name_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }
}
