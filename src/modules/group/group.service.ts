import { Injectable } from '@nestjs/common'
import { CreateGroupDto, UpdateGroupDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Group } from './entities/group.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { GroupResponse, StatusGroupResponse } from './response'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    private readonly historyService: TransactionHistoryService,
  ) {}

  async create(group: CreateGroupDto, user_id: number): Promise<StatusGroupResponse> {
    try {
      const newGroup = await this.groupRepository.create({ ...group })

      const historyDto = {
        user_id: user_id,
        comment: `Создана группа #${newGroup.group_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newGroup }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<GroupResponse[]> {
    try {
      const foundGroups = await this.groupRepository.findAll()
      return foundGroups
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(group_id: number) {
    try {
      const result = await this.groupRepository.findOne({
        where: { group_id },
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

  async update(updatedGroup: UpdateGroupDto, user_id: number): Promise<GroupResponse> {
    try {
      await this.groupRepository.update({ ...updatedGroup }, { where: { group_id: updatedGroup.group_id } })

      const foundGroup = await this.groupRepository.findOne({
        where: { group_id: updatedGroup.group_id },
      })

      if (foundGroup) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменена группа #${foundGroup.group_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundGroup
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(group_id: number, user_id: number) {
    try {
      const deleteGroup = await this.groupRepository.destroy({
        where: { group_id },
      })

      if (deleteGroup) {
        const historyDto = {
          user_id: user_id,
          comment: `Удалена группа #${group_id}`,
        }
        await this.historyService.create(historyDto)

        return { status: true }
      }

      return { status: false }
    } catch (error) {
      return new Error(error)
    }
  }
}
