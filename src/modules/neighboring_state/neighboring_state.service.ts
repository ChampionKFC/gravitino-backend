import { Injectable } from '@nestjs/common'
import { CreateNeighboringStateDto, UpdateNeighboringStateDto } from './dto'
import { NeighboringState } from './entities/neighboring_state.entity'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { NeighboringStateResponse, StatusNeighboringStateResponse } from './response'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class NeighboringStateService {
  constructor(
    @InjectModel(NeighboringState)
    private neighboringStateRepository: typeof NeighboringState,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createNeighboringStateDto: CreateNeighboringStateDto, user_id: number): Promise<StatusNeighboringStateResponse> {
    try {
      const newNeighboringState = await this.neighboringStateRepository.create({
        ...createNeighboringStateDto,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_NEIGHBORING_STATE_CREATED}${newNeighboringState.neighboring_state_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newNeighboringState }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<NeighboringStateResponse[]> {
    try {
      const foundNeighboringStates = await this.neighboringStateRepository.findAll()

      return foundNeighboringStates
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(neighboring_state_id: number): Promise<boolean> {
    try {
      const result = await this.neighboringStateRepository.findOne({
        where: { neighboring_state_id },
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

  async update(updateNeighboringStateDto: UpdateNeighboringStateDto, user_id: number): Promise<StatusNeighboringStateResponse> {
    try {
      const updateNeighboringState = await this.neighboringStateRepository.update(
        { ...updateNeighboringStateDto },
        { where: { neighboring_state_id: updateNeighboringStateDto.neighboring_state_id } },
      )

      if (updateNeighboringState) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_NEIGHBORING_STATE_UPDATED}${updateNeighboringStateDto.neighboring_state_id}`,
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

  async remove(neighboring_state_id: number, user_id: number): Promise<StatusNeighboringStateResponse> {
    try {
      const deleteNeighboringState = await this.neighboringStateRepository.destroy({
        where: { neighboring_state_id },
      })

      if (deleteNeighboringState) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_NEIGHBORING_STATE_DELETED}${neighboring_state_id}`,
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
