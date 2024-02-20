import { Injectable } from '@nestjs/common'
import { ReportDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Report } from './entities/report.entity'
import { Sequelize } from 'sequelize-typescript'
import { ArrayBranchReportResponse } from './response'
import { OrderService } from '../order/order.service'
import { BranchService } from '../branch/branch.service'

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report) private reportRepository: typeof Report,
    private readonly orderService: OrderService,
    private readonly branchService: BranchService,
    private readonly sequelize: Sequelize,
  ) {}

  async generateBranchReport(reportDto: ReportDto): Promise<ArrayBranchReportResponse> {
    try {
      const branchReport = []
      const branches = await this.branchService.findAll({})

      for (const branch of branches.data) {
        const orders = await this.orderService.findAllByBranch([branch.branch_id], {
          period: { date_start: reportDto.period_start, date_end: reportDto.period_end },
        })

        const allCount = orders.data.length

        const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5)
        const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

        const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
        const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

        console.log(allCount, completed.length, checked.length)

        branchReport.push({
          branch: branch,
          completed_count: completed.length,
          completed_percent: completedPercent,
          checked_count: checked.length,
          checked_percent: checkedPercent,
        })
      }

      return { count: branchReport.length, data: branchReport }
    } catch (error) {
      console.log('REPORT:', error)

      throw new Error(error)
    }
  }
}
