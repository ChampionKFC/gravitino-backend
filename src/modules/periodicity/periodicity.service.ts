import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Periodicity } from './entities/periodicity.entity'
import { ArrayPeriodicityResponse } from './response'
import { PeriodicityFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { QueryTypes } from 'sequelize'

@Injectable()
export class PeriodicityService {
  constructor(
    @InjectModel(Periodicity) private periodicityRepository: typeof Periodicity,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(periodicityFilter: PeriodicityFilter): Promise<ArrayPeriodicityResponse> {
    try {
      const offset_count = periodicityFilter.offset?.count == undefined ? 50 : periodicityFilter.offset.count
      const offset_page = periodicityFilter.offset?.page == undefined ? 1 : periodicityFilter.offset.page

      let whereQuery = ''
      if (periodicityFilter?.filter) {
        whereQuery = generateWhereQuery(periodicityFilter?.filter)
      }
      let sortQuery = ''
      if (periodicityFilter?.sorts) {
        sortQuery = generateSortQuery(periodicityFilter?.sorts)
      }

      const foundPeriodicity = await this.sequelize.query<Periodicity>(
        `
         SELECT
          "periodicity_id", 
          "periodicity_name",
          "createdAt",
          "updatedAt"
        FROM
          "Periodicities" AS "Periodicity"
        ${whereQuery}
        ${sortQuery}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: foundPeriodicity.length, data: foundPeriodicity }
    } catch (error) {
      throw new Error(error)
    }
  }
}
