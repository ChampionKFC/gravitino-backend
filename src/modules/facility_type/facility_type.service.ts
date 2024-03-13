import { Injectable } from '@nestjs/common'
import { CreateFacilityTypeDto, UpdateFacilityTypeDto } from './dto'
import { FacilityType } from './entities/facility_type.entity'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayFacilityTypeResponse, StatusFacilityTypeResponse } from './response'

@Injectable()
export class FacilityTypeService {
  constructor(
    @InjectModel(FacilityType) private facilityTypeRepository: typeof FacilityType,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createFacilityTypeDto: CreateFacilityTypeDto, user_id: number) {
    const transaction = await this.sequelize.transaction()
    try {
      const newFacilityType = await this.facilityTypeRepository.create({ ...createFacilityTypeDto }, { transaction })

      if (newFacilityType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FACILITY_TYPE_CREATED}${newFacilityType.facility_type_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        transaction.commit()
        return { status: true, data: newFacilityType }
      } else {
        transaction.rollback()
        return { status: false }
      }
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }

  async findAll(): Promise<ArrayFacilityTypeResponse> {
    try {
      const result = await this.facilityTypeRepository.findAll({ order: [['createdAt', 'DESC']] })

      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(facility_type_id: number): Promise<boolean> {
    try {
      const foundFacilityType = await this.facilityTypeRepository.findOne({
        where: { facility_type_id },
      })
      if (foundFacilityType) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updateFacilityTypeDto: UpdateFacilityTypeDto, user_id): Promise<StatusFacilityTypeResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      const updateFacilityType = await this.facilityTypeRepository.update(
        { ...updateFacilityTypeDto },
        { where: { facility_type_id: updateFacilityTypeDto.facility_type_id }, transaction },
      )

      if (updateFacilityType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FACILITY_TYPE_UPDATED}${updateFacilityTypeDto.facility_type_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        transaction.commit()
        return { status: true }
      } else {
        transaction.rollback()
        return { status: false }
      }
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }

  async remove(facility_type_id: number, user_id: number): Promise<StatusFacilityTypeResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      const deleteFacilityType = await this.facilityTypeRepository.destroy({
        where: { facility_type_id },
        transaction,
      })

      if (deleteFacilityType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FACILITY_TYPE_DELETED}${facility_type_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        transaction.commit()
        return { status: true }
      } else {
        transaction.rollback()
        return { status: false }
      }
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }
}
