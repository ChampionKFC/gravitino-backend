import { Injectable } from '@nestjs/common'
import { CreatePropertyValueDto, UpdatePropertyValueDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { PropertyValue } from './entities/property_value.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayPropertyValueResponse, PropertyValueResponse, StatusPropertValueResponse } from './response'
import { PropertyName } from '../property_names/entities/property_name.entity'
import { AppStrings } from 'src/common/constants/strings'
import { Transaction } from 'sequelize'

@Injectable()
export class PropertyValuesService {
  constructor(
    @InjectModel(PropertyValue)
    private propertyValueRepository: typeof PropertyValue,
    private readonly historyService: TransactionHistoryService,
  ) {}

  async create(createPropertyValueDto: CreatePropertyValueDto, user_id: number, transaction?: Transaction): Promise<StatusPropertValueResponse> {
    try {
      const newPropertyValue = await this.propertyValueRepository.create(
        {
          ...createPropertyValueDto,
        },
        { transaction },
      )

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PROPERTY_VALUE_CREATED}${newPropertyValue.property_value_id}`,
      }
      await this.historyService.create(historyDto, transaction)

      return { status: true, data: newPropertyValue }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<ArrayPropertyValueResponse> {
    try {
      const result = await this.propertyValueRepository.findAll({ include: [PropertyName], attributes: { exclude: ['property_name_id'] } })
      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(property_value_id: number): Promise<boolean> {
    try {
      const foundPropertyValue = await this.propertyValueRepository.findOne({
        where: { property_value_id },
      })

      if (foundPropertyValue) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatePropertyValueDto: UpdatePropertyValueDto, user_id: number): Promise<PropertyValueResponse> {
    try {
      let foundPropertyValue = null
      await this.propertyValueRepository.update(
        { ...updatePropertyValueDto },
        {
          where: {
            property_value_id: updatePropertyValueDto.property_value_id,
          },
        },
      )

      foundPropertyValue = await this.propertyValueRepository.findOne({
        where: { property_value_id: updatePropertyValueDto.property_value_id },
      })

      if (foundPropertyValue) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PROPERTY_VALUE_UPDATED}${foundPropertyValue.property_value_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundPropertyValue
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(property_value_id: number, user_id: number): Promise<StatusPropertValueResponse> {
    const deletePropertyValue = await this.propertyValueRepository.destroy({
      where: { property_value_id },
    })

    if (deletePropertyValue) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PROPERTY_VALUE_DELETED}${property_value_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }
}
