import { Injectable } from '@nestjs/common'
import { CreatePropertyNameDto, UpdatePropertyNameDto } from './dto'
import { PropertyName } from './entities/property_name.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayPropertyNameResponse, StatusPropertyNameResponse } from './response'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class PropertyNamesService {
  constructor(
    @InjectModel(PropertyName)
    private propertyNameRepository: typeof PropertyName,
    private readonly historyService: TransactionHistoryService,
  ) {}

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

  async findAll(): Promise<ArrayPropertyNameResponse> {
    try {
      const result = await this.propertyNameRepository.findAll()
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

  async update(updatePropertyNameDto: UpdatePropertyNameDto, user_id: number) {
    try {
      let foundPropertyName = null
      await this.propertyNameRepository.update({ ...updatePropertyNameDto }, { where: { property_name_id: updatePropertyNameDto.property_name_id } })

      foundPropertyName = await this.propertyNameRepository.findOne({
        where: { property_name_id: updatePropertyNameDto.property_name_id },
      })

      if (foundPropertyName) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_PROPERTY_NAME_UPDATED}${foundPropertyName.property_name_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundPropertyName
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(property_name_id: number, user_id: number) {
    const deletePropertyName = await this.propertyNameRepository.destroy({
      where: { property_name_id },
    })

    if (deletePropertyName) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_PROPERTY_NAME_DELETED}${property_name_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }
}
