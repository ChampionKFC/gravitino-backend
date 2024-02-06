import { Injectable } from '@nestjs/common'
import { CreateOperatingModeDto, UpdateOperatingModeDto } from './dto'
import { OperatingMode } from './entities/operating_mode.entity'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { OperatingModeResponse, StatusOperatingModeResponse } from './response'

@Injectable()
export class OperatingModeService {
  constructor(
    @InjectModel(OperatingMode)
    private operatingModeRepository: typeof OperatingMode,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createOperatingModeDto: CreateOperatingModeDto, user_id: number): Promise<StatusOperatingModeResponse> {
    try {
      const newOperatingMode = await this.operatingModeRepository.create({
        ...createOperatingModeDto,
      })

      const historyDto = {
        user_id: user_id,
        comment: `Создан режим работы #${newOperatingMode.operating_mode_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newOperatingMode }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<OperatingModeResponse[]> {
    try {
      const foundOperatingModes = await this.operatingModeRepository.findAll()

      return foundOperatingModes
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(operating_mode_id: number): Promise<boolean> {
    try {
      const result = await this.operatingModeRepository.findOne({
        where: { operating_mode_id },
      })

      if (result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updateOperatingModeDto: UpdateOperatingModeDto, user_id: number): Promise<StatusOperatingModeResponse> {
    try {
      const updateOperatingMode = await this.operatingModeRepository.update(
        { ...updateOperatingModeDto },
        { where: { operating_mode_id: updateOperatingModeDto.operating_mode_id } },
      )

      if (updateOperatingMode) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменен режим работы #${updateOperatingModeDto.operating_mode_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      } else {
        return { status: false }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(operating_mode_id: number, user_id: number): Promise<StatusOperatingModeResponse> {
    try {
      const deleteOperatingMode = await this.operatingModeRepository.destroy({
        where: { operating_mode_id },
      })

      if (deleteOperatingMode) {
        const historyDto = {
          user_id: user_id,
          comment: `Удален режим работы  #${operating_mode_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      } else {
        return { status: false }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
