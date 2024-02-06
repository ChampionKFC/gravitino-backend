import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { Branch } from './entities/branch.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHistoryService } from '../transaction_history/transaction_history.service';
import { BranchResponse, StatusBranchResponse } from './response';
import { BranchFilter } from './filters';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import {
  generateWhereQuery,
  generateSortQuery,
} from 'src/common/utlis/generate_sort_query';
@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch) private branchRepository: typeof Branch,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createBranchDto: CreateBranchDto,
    user_id: number,
  ): Promise<StatusBranchResponse> {
    const newBranch = await this.branchRepository.create({
      ...createBranchDto,
    });

    const historyDto = {
      user_id: user_id,
      comment: `Создан филиал #${newBranch.branch_id}`,
    };
    await this.historyService.create(historyDto);

    return { status: true, data: newBranch };
  }

  async findAll(branchFilter?: BranchFilter): Promise<BranchResponse[]> {
    try {
      const offset_count =
        branchFilter.offset?.count == undefined
          ? 50
          : branchFilter.offset.count;
      const offset_page =
        branchFilter.offset?.page == undefined ? 1 : branchFilter.offset.page;

      let whereQuery = '';
      if (branchFilter?.filter) {
        whereQuery = generateWhereQuery(branchFilter?.filter);
      }
      let sortQuery = '';
      if (branchFilter?.sorts) {
        sortQuery = generateSortQuery(branchFilter?.sorts);
      }

      const result = await this.sequelize.query<Branch>(
        `
          SELECT
            "branch_id",
            "branch_name",
            "branch_address",
            "createdAt",
            "updatedAt"
          FROM
            "Branches" AS "Branch"
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

  async findOne(branch_id: number): Promise<boolean> {
    try {
      const foundBranch = await this.branchRepository.findOne({
        where: { branch_id },
      });

      if (foundBranch) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    updateBranchDto: UpdateBranchDto,
    user_id: number,
  ): Promise<BranchResponse> {
    try {
      let foundBranch = null;
      await this.branchRepository.update(
        { ...updateBranchDto },
        { where: { branch_id: updateBranchDto.branch_id } },
      );

      foundBranch = await this.branchRepository.findOne({
        where: { branch_id: updateBranchDto.branch_id },
      });

      if (foundBranch) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменен филиал #${foundBranch.branch_id}`,
        };
        await this.historyService.create(historyDto);
      }

      return foundBranch;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(
    branch_id: number,
    user_id: number,
  ): Promise<StatusBranchResponse> {
    const deleteBranch = await this.branchRepository.destroy({
      where: { branch_id },
    });

    if (deleteBranch) {
      const historyDto = {
        user_id: user_id,
        comment: `Удален филиал #${branch_id}`,
      };
      await this.historyService.create(historyDto);

      return { status: true };
    }

    return { status: false };
  }
}
