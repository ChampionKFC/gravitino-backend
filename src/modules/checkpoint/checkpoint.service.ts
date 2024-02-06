import { Injectable } from '@nestjs/common';
import { CreateCheckpointDto, UpdateCheckpointDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Checkpoint } from './entities/checkpoint.entity';
import { TransactionHistoryService } from '../transaction_history/transaction_history.service';
import { CheckpointResponse, StatusCheckpointResponse } from './response';
import {
  generateWhereQuery,
  generateSortQuery,
} from 'src/common/utlis/generate_sort_query';
import { CheckpointFilter } from './filters';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CheckpointService {
  constructor(
    @InjectModel(Checkpoint) private checkpointRepository: typeof Checkpoint,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    checkpoint: CreateCheckpointDto,
    user_id: number,
  ): Promise<StatusCheckpointResponse> {
    const newCheckpoint = await this.checkpointRepository.create({
      ...checkpoint,
    });

    const historyDto = {
      user_id: user_id,
      comment: `Создан пункт пропуска #${newCheckpoint.checkpoint_id}`,
    };
    await this.historyService.create(historyDto);

    return { status: true, data: newCheckpoint };
  }

  async findAll(
    checkpointFilter?: CheckpointFilter,
  ): Promise<CheckpointResponse[]> {
    try {
      const offset_count =
        checkpointFilter.offset?.count == undefined
          ? 50
          : checkpointFilter.offset.count;
      const offset_page =
        checkpointFilter.offset?.page == undefined
          ? 1
          : checkpointFilter.offset.page;

      let whereQuery = '';
      if (checkpointFilter?.filter) {
        whereQuery = generateWhereQuery(checkpointFilter?.filter);
      }
      let sortQuery = '';
      if (checkpointFilter?.sorts) {
        sortQuery = generateSortQuery(checkpointFilter?.sorts);
      }

      const result = this.sequelize.query<Checkpoint>(
        `
        SELECT * FROM (
          SELECT
            "checkpoint_id",
            "checkpoint_name",
            "address",
            "branch"."branch_id" AS "branch.branch_id",
            "branch"."branch_name" AS "branch.branch_name",
            "branch"."branch_address" AS "branch.branch_address",
            "neighboring_state",
            "district",
            "region",
            "checkpoint_type"."checkpoint_type_id" AS "checkpoint_type.checkpoint_type_id",
            "checkpoint_type"."checkpoint_type_name" AS "checkpoint_type.checkpoint_type_name",
            "working_hours",
            "operating_mode",
            "property_values"
          FROM 
            "Checkpoints" AS "Checkpoint"
            LEFT JOIN "CheckpointTypes" AS "checkpoint_type" ON "Checkpoint"."checkpoint_type_id" = "checkpoint_type"."checkpoint_type_id"
            LEFT JOIN "Branches" AS "branch" ON "Checkpoint"."branch_id" = "branch"."branch_id"
        )
        ${whereQuery}
        ${sortQuery}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      );

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(checkpoint_id: number): Promise<boolean> {
    try {
      const foundCheckpoint = await this.checkpointRepository.findOne({
        where: { checkpoint_id },
      });

      if (foundCheckpoint) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByBranch(
    branch_ids: number[],
    checkpointFilter?: CheckpointFilter,
  ) {
    try {
      let result = [];

      if (!checkpointFilter.filter) {
        checkpointFilter.filter = {};
      }

      for (let index = 0; index < branch_ids.length; index++) {
        const id = branch_ids[index];

        checkpointFilter.filter.branch = {
          branch_id: +id,
        };
        result = [...result, ...(await this.findAll(checkpointFilter))];
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    updatedCheckpoint: UpdateCheckpointDto,
    user_id: number,
  ): Promise<CheckpointResponse> {
    try {
      let foundCheckpoint = null;
      await this.checkpointRepository.update(
        { ...updatedCheckpoint },
        { where: { checkpoint_id: updatedCheckpoint.checkpoint_id } },
      );

      foundCheckpoint = await this.checkpointRepository.findOne({
        where: { checkpoint_id: updatedCheckpoint.checkpoint_id },
      });

      if (foundCheckpoint) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменен пункт пропуска #${foundCheckpoint.checkpoint_id}`,
        };
        await this.historyService.create(historyDto);
      }

      return foundCheckpoint;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(
    checkpoint_id: number,
    user_id: number,
  ): Promise<StatusCheckpointResponse> {
    const deleteCheckpoint = await this.checkpointRepository.destroy({
      where: { checkpoint_id },
    });

    if (deleteCheckpoint) {
      const historyDto = {
        user_id: user_id,
        comment: `Удален пункт пропуска #${checkpoint_id}`,
      };
      await this.historyService.create(historyDto);

      return { status: true };
    }

    return { status: false };
  }
}