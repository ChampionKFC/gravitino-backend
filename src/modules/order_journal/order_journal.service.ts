import { Injectable } from '@nestjs/common';
import { CreateOrderJournalDto, UpdateOrderJournalDto } from './dto';
import { OrderJournal } from './entities/order_journal.entity';
import { InjectModel } from '@nestjs/sequelize';
import { OrderJournalResponse, StatusOrderJournalResponse } from './response';
import { User } from '../users/entities/user.entity';
import { Person } from '../person/entities/person.entity';
import { Sequelize } from 'sequelize-typescript';
import { Role } from '../roles/entities/role.entity';
import { Organization } from '../organization/entities/organization.entity';
import { OrderStatus } from '../order_status/entities/order_status.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderJournalService {
  constructor(
    @InjectModel(OrderJournal)
    private orderJournalRepository: typeof OrderJournal,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createOrderJournalDto: CreateOrderJournalDto,
    transaction?: Transaction,
  ): Promise<StatusOrderJournalResponse> {
    try {
      const newOrderJournal = await this.orderJournalRepository.create(
        {
          ...createOrderJournalDto,
        },
        { transaction },
      );
      console.log(newOrderJournal);

      return { status: true, data: newOrderJournal };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(order_id: number): Promise<OrderJournalResponse[]> {
    try {
      const result = await this.orderJournalRepository.findAll({
        include: [
          {
            model: User,
            include: [
              {
                model: Person,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
              {
                model: Role,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
              {
                model: Organization,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
            attributes: {
              exclude: [
                'person_id',
                'role_id',
                'organization_id',
                'createdAt',
                'updatedAt',
              ],
            },
          },
          {
            model: OrderStatus,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
        attributes: { exclude: ['user_id', 'order_id', 'order_status_id'] },
        where: { order_id },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(order_journal_id: number): Promise<boolean> {
    try {
      const foundOrderJournal = await this.orderJournalRepository.findOne({
        where: { order_journal_id },
      });

      if (foundOrderJournal) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    updateOrderJournalDto: UpdateOrderJournalDto,
  ): Promise<StatusOrderJournalResponse> {
    try {
      const updateJournal = await this.orderJournalRepository.update(
        { ...updateOrderJournalDto },
        { where: { order_journal_id: updateOrderJournalDto.order_journal_id } },
      );

      if (updateJournal) {
        return { status: true };
      } else {
        return { status: false };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(order_journal_id: number): Promise<StatusOrderJournalResponse> {
    try {
      const deleteOrderJournal = await this.orderJournalRepository.destroy({
        where: { order_journal_id },
      });

      if (deleteOrderJournal) {
        return { status: true };
      } else {
        return { status: false };
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
