import { Injectable } from '@nestjs/common'
import { CreateWorkingHourDto, UpdateWorkingHourDto } from './dto'
import { WorkingHours } from './entities/working_hour.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { Sequelize } from 'sequelize-typescript'
import { StatusWorkingHoursResponse, WorkingHoursResponse } from './response'
import { InjectModel } from '@nestjs/sequelize'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectModel(WorkingHours)
    private workingHoursRepository: typeof WorkingHours,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createWorkingHourDto: CreateWorkingHourDto, user_id: number): Promise<StatusWorkingHoursResponse> {
    try {
      const newWorkingHours = await this.workingHoursRepository.create({
        ...createWorkingHourDto,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_WORKING_HOURS_CREATED}${newWorkingHours.working_hours_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newWorkingHours }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<WorkingHoursResponse[]> {
    try {
      const foundWorkingHours = await this.workingHoursRepository.findAll()

      return foundWorkingHours
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(working_hours_id: number): Promise<boolean> {
    try {
      const result = await this.workingHoursRepository.findOne({
        where: { working_hours_id },
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

  async update(updateWorkingHourDto: UpdateWorkingHourDto, user_id: number): Promise<StatusWorkingHoursResponse> {
    try {
      const updateWorkingHours = await this.workingHoursRepository.update(
        { ...updateWorkingHourDto },
        { where: { working_hours_id: updateWorkingHourDto.working_hours_id } },
      )

      if (updateWorkingHours) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_WORKING_HOURS_UPDATED}${updateWorkingHourDto.working_hours_id}`,
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

  async remove(working_hours_id: number, user_id: number): Promise<StatusWorkingHoursResponse> {
    try {
      const deleteWorkingHours = await this.workingHoursRepository.destroy({
        where: { working_hours_id },
      })

      if (deleteWorkingHours) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_WORKING_HOURS_DELETED}${working_hours_id}`,
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
