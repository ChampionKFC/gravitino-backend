import { HttpException, Injectable } from '@nestjs/common'
import { CreateBranchDto, UpdateBranchDto } from './dto'
import { Branch } from './entities/branch.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayBranchResponse, BranchResponse, StatusBranchResponse } from './response'
import { BranchFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { QueryTypes, Transaction } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import * as xlsx from 'xlsx'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch) private branchRepository: typeof Branch,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createBranchDto: CreateBranchDto, user_id: number, trx?: Transaction): Promise<StatusBranchResponse> {
    const transaction = trx ?? (await this.sequelize.transaction())
    try {
      const newBranch = await this.branchRepository.create({
        ...createBranchDto,
        transaction,
      })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_BRANCH_CREATED}${newBranch.branch_id}`,
      }
      await this.historyService.create(historyDto, transaction)

      if (!trx) transaction.commit()
      return { status: true, data: newBranch }
    } catch (error) {
      if (!trx) transaction.rollback()
      throw new HttpException(error.message, error.status)
    }
  }

  async findAll(branchFilter: BranchFilter): Promise<ArrayBranchResponse> {
    try {
      const offset_count = branchFilter.offset?.count == undefined ? 50 : branchFilter.offset.count
      const offset_page = branchFilter.offset?.page == undefined ? 1 : branchFilter.offset.page

      let whereQuery = ''
      if (branchFilter?.filter) {
        whereQuery = generateWhereQuery(branchFilter?.filter)
      }
      let sortQuery = ''
      if (branchFilter?.sorts) {
        sortQuery = generateSortQuery(branchFilter?.sorts)
      }

      if (sortQuery == '') {
        sortQuery = 'ORDER BY "createdAt" DESC'
      }

      const selectQuery = `
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
      `

      const count = (
        await this.sequelize.query<Branch>(selectQuery, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length

      const result = await this.sequelize.query<Branch>(
        `
          ${selectQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )
      return { count: count, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(branch_id: number): Promise<boolean> {
    try {
      const foundBranch = await this.branchRepository.findOne({
        where: { branch_id },
      })

      if (foundBranch) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updateBranchDto: UpdateBranchDto, user_id: number, trx?: Transaction): Promise<BranchResponse> {
    const transaction = trx ?? (await this.sequelize.transaction())
    try {
      let foundBranch = null
      await this.branchRepository.update({ ...updateBranchDto }, { where: { branch_id: updateBranchDto.branch_id }, transaction })

      foundBranch = await this.branchRepository.findOne({
        where: { branch_id: updateBranchDto.branch_id },
      })

      if (foundBranch) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_BRANCH_UPDATED}${foundBranch.branch_id}`,
        }
        await this.historyService.create(historyDto, transaction)
      }

      if (!trx) transaction.commit()

      return foundBranch
    } catch (error) {
      if (!trx) transaction.rollback()
      throw new Error(error)
    }
  }

  async remove(branch_id: number, user_id: number): Promise<StatusBranchResponse> {
    const deleteBranch = await this.branchRepository.destroy({
      where: { branch_id },
    })

    if (deleteBranch) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_BRANCH_DELETED}${branch_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }

  async import(file: Express.Multer.File, user_id: string): Promise<StatusBranchResponse> {
    const transaction = await this.sequelize.transaction()

    try {
      const entities = await this.previewImport(file)
      for (const entity of entities) {
        const pk = entity.branch_id
        if (pk) {
          const exists = await this.findOne(pk)
          if (exists) {
            await this.update(entity, +user_id, transaction)
          } else {
            await this.create(entity, +user_id, transaction)
          }
        } else {
          await this.create(entity, +user_id, transaction)
        }
      }

      transaction.commit()
      return { status: true }
    } catch (error) {
      console.log('IMPORT:', error)

      transaction.rollback()
      throw new HttpException(error.message, error.status)
    }
  }

  async previewImport(file: Express.Multer.File): Promise<any> {
    try {
      const workbook = xlsx.read(file.buffer)

      const ws = workbook.Sheets[workbook.SheetNames[0]]
      const range = xlsx.utils.decode_range(ws['!ref'])

      const entities = []

      for (let R = range.s.r; R <= range.e.r; ++R) {
        if (R === 0) {
          continue
        }
        let col = 0

        const entity = {
          branch_id: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          branch_name: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
          branch_address: ws[xlsx.utils.encode_cell({ c: col++, r: R })]?.v,
        }

        entities.push(entity)
      }

      return entities
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
