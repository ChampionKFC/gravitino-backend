import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Report } from './entities/report.entity'
import { Sequelize } from 'sequelize-typescript'
import { ArrayBranchReportResponse, ArrayCheckpointReportResponse } from './response'
import { OrderService } from '../order/order.service'
import { BranchService } from '../branch/branch.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityService } from '../facility/facility.service'
import { BranchReportFilter, CheckpointReportFilter, OrganizationReportFilter } from './filters'

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report) private reportRepository: typeof Report,
    private readonly orderService: OrderService,
    private readonly branchService: BranchService,
    private readonly checkpointService: CheckpointService,
    private readonly facilityService: FacilityService,
    private readonly sequelize: Sequelize,
  ) {}

  async generateBranchReport(reportFilter: BranchReportFilter): Promise<ArrayBranchReportResponse> {
    try {
      const offset_count = reportFilter.offset?.count == undefined ? 50 : reportFilter.offset.count
      const offset_page = reportFilter.offset?.page == undefined ? 1 : reportFilter.offset.page

      const branchReport = []
      const branches = await this.branchService.findAll({})

      for (const branch of branches.data) {
        const orders = await this.orderService.findAllByBranch([branch.branch_id], {
          period: { date_start: reportFilter.period.period_start, date_end: reportFilter.period.period_end },
        })

        const allCount = orders.data.length

        const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5)
        const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

        const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
        const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

        branchReport.push({
          branch: branch,
          all_count: allCount,
          completed_count: completed.length,
          completed_percent: completedPercent,
          checked_count: checked.length,
          checked_percent: checkedPercent,
        })
      }

      const filtered = branchReport.filter(
        (report) =>
          (reportFilter?.filter?.report?.completed_count != null ? report.completed_count > reportFilter.filter.report.completed_count : true) &&
          (reportFilter?.filter?.report?.completed_percent != null ? report.completed_percent > reportFilter.filter.report.completed_percent : true) &&
          (reportFilter?.filter?.report?.checked_count != null ? report.checked_count > reportFilter.filter.report.checked_count : true) &&
          (reportFilter?.filter?.report?.checked_percent != null ? report.checked_percent > reportFilter.filter.report.checked_percent : true) &&
          (reportFilter?.filter?.branch?.branch_id != null ? report.branch.branch_id === reportFilter.filter.branch.branch_id : true) &&
          (reportFilter?.filter?.branch?.branch_name != null ? report.branch.branch_name === reportFilter.filter.branch.branch_name : true) &&
          (reportFilter?.filter?.branch?.branch_address != null ? report.branch.branch_address === reportFilter.filter.branch.branch_address : true),
      )

      const sorted = filtered.sort(
        (report1, report2) =>
          (reportFilter?.sorts?.report?.completed_count == 'DESC'
            ? report2.completed_count - report1.completed_count
            : reportFilter?.sorts?.report?.completed_count
              ? report1.completed_count - report2.completed_count
              : 0) +
          (reportFilter?.sorts?.report?.completed_percent == 'DESC'
            ? report2.completed_percent - report1.completed_percent
            : reportFilter?.sorts?.report?.completed_percent
              ? report1.completed_percent - report2.completed_percent
              : 0) +
          (reportFilter?.sorts?.report?.checked_count == 'DESC'
            ? report2.checked_count - report1.checked_count
            : reportFilter?.sorts?.report?.checked_count
              ? report1.checked_count - report2.checked_count
              : 0) +
          (reportFilter?.sorts?.report?.checked_percent == 'DESC'
            ? report2.checked_percent - report1.checked_percent
            : reportFilter?.sorts?.report?.checked_percent
              ? report1.checked_percent - report2.checked_percent
              : 0) +
          (reportFilter?.sorts?.branch?.branch_id == 'DESC'
            ? report2.branch.branch_id - report1.branch.branch_id
            : reportFilter?.sorts?.branch?.branch_id
              ? report1.branch.branch_id - report2.branch.branch_id
              : 0) +
          (reportFilter?.sorts?.branch?.branch_name == 'DESC'
            ? report2.branch.branch_name.localeCompare(report1.branch.branch_name)
            : reportFilter?.sorts?.branch?.branch_name
              ? report1.branch.branch_name.localeCompare(report2.branch.branch_name)
              : 0) +
          (reportFilter?.sorts?.branch?.branch_address == 'DESC'
            ? report2.branch.branch_address.localeCompare(report1.branch.branch_address)
            : reportFilter?.sorts?.branch?.branch_address
              ? report1.branch.branch_address.localeCompare(report2.branch.branch_address)
              : 0),
      )

      const result = sorted.splice(offset_count * (offset_page - 1), offset_count)
      return { count: branchReport.length, data: result }
    } catch (error) {
      console.log('REPORT:', error)

      throw new Error(error)
    }
  }

  async generateCheckpointReport(branch_id: string, reportFilter: CheckpointReportFilter): Promise<ArrayCheckpointReportResponse> {
    try {
      const offset_count = reportFilter.offset?.count == undefined ? 50 : reportFilter.offset.count
      const offset_page = reportFilter.offset?.page == undefined ? 1 : reportFilter.offset.page

      const checkpointReport = []
      const checkpoints = await this.checkpointService.findAllByBranch([+branch_id], {})
      for (const checkpoint of checkpoints.data) {
        const orders = await this.orderService.findAllByCheckpoint([checkpoint.checkpoint_id], {
          period: { date_start: reportFilter.period.period_start, date_end: reportFilter.period.period_end },
        })

        const allCount = orders.data.length

        const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5)
        const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

        const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
        const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

        checkpointReport.push({
          checkpoint: checkpoint,
          all_count: allCount,
          completed_count: completed.length,
          completed_percent: completedPercent,
          checked_count: checked.length,
          checked_percent: checkedPercent,
        })
      }

      const filtered = checkpointReport.filter(
        (report) =>
          (reportFilter?.filter?.report?.completed_count != null ? report.completed_count > reportFilter.filter.report.completed_count : true) &&
          (reportFilter?.filter?.report?.completed_percent != null ? report.completed_percent > reportFilter.filter.report.completed_percent : true) &&
          (reportFilter?.filter?.report?.checked_count != null ? report.checked_count > reportFilter.filter.report.checked_count : true) &&
          (reportFilter?.filter?.report?.checked_percent != null ? report.checked_percent > reportFilter.filter.report.checked_percent : true) &&
          (reportFilter?.filter?.checkpoint?.checkpoint_id != null ? report.checkpoint.checkpoint_id === reportFilter.filter.checkpoint.checkpoint_id : true) &&
          (reportFilter?.filter?.checkpoint?.checkpoint_name != null
            ? report.checkpoint.checkpoint_name === reportFilter.filter.checkpoint.checkpoint_name
            : true) &&
          (reportFilter?.filter?.checkpoint?.neighboring_state.neighboring_state_id != null
            ? report.checkpoint.neighboring_state.neighboring_state_id === reportFilter.filter.checkpoint.neighboring_state.neighboring_state_id
            : true) &&
          (reportFilter?.filter?.checkpoint?.neighboring_state.neighboring_state_name != null
            ? report.checkpoint.neighboring_state.neighboring_state_name === reportFilter.filter.checkpoint.neighboring_state.neighboring_state_name
            : true),
      )

      const sorted = filtered.sort(
        (report1, report2) =>
          (reportFilter?.sorts?.report?.completed_count == 'DESC'
            ? report2.completed_count - report1.completed_count
            : reportFilter?.sorts?.report?.completed_count
              ? report1.completed_count - report2.completed_count
              : 0) +
          (reportFilter?.sorts?.report?.completed_percent == 'DESC'
            ? report2.completed_percent - report1.completed_percent
            : reportFilter?.sorts?.report?.completed_percent
              ? report1.completed_percent - report2.completed_percent
              : 0) +
          (reportFilter?.sorts?.report?.checked_count == 'DESC'
            ? report2.checked_count - report1.checked_count
            : reportFilter?.sorts?.report?.checked_count
              ? report1.checked_count - report2.checked_count
              : 0) +
          (reportFilter?.sorts?.report?.checked_percent == 'DESC'
            ? report2.checked_percent - report1.checked_percent
            : reportFilter?.sorts?.report?.checked_percent
              ? report1.checked_percent - report2.checked_percent
              : 0) +
          (reportFilter?.sorts?.checkpoint?.checkpoint_id == 'DESC'
            ? report2.checkpoint.checkpoint_id - report1.checkpoint.checkpoint_id
            : reportFilter?.sorts?.checkpoint?.checkpoint_id
              ? report1.checkpoint.checkpoint_id - report2.checkpoint.checkpoint_id
              : 0) +
          (reportFilter?.sorts?.checkpoint?.checkpoint_name == 'DESC'
            ? report2.checkpoint.checkpoint_name.localeCompare(report1.checkpoint.checkpoint_name)
            : reportFilter?.sorts?.checkpoint?.checkpoint_name
              ? report1.checkpoint.checkpoint_name.localeCompare(report2.checkpoint.checkpoint_name)
              : 0) +
          (reportFilter?.sorts?.checkpoint?.neighboring_state?.neighboring_state_name == 'DESC'
            ? report2.checkpoint.neighboring_state.neighboring_state_name.localeCompare(report1.checkpoint.neighboring_state.neighboring_state_name)
            : reportFilter?.sorts?.checkpoint?.neighboring_state?.neighboring_state_name
              ? report1.checkpoint.neighboring_state.neighboring_state_name.localeCompare(report2.checkpoint.neighboring_state.neighboring_state_name)
              : 0),
      )

      const result = sorted.splice(offset_count * (offset_page - 1), offset_count)
      return { count: checkpointReport.length, data: result }
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }

  async generateOrganizationReport(checkpoint_id: string, reportFilter: OrganizationReportFilter): Promise<ArrayCheckpointReportResponse> {
    try {
      const offset_count = reportFilter.offset?.count == undefined ? 50 : reportFilter.offset.count
      const offset_page = reportFilter.offset?.page == undefined ? 1 : reportFilter.offset.page

      const organizationReport = []
      const organizations = await this.facilityService.findOrganizationsByCheckpoint(checkpoint_id)
      for (const organization of organizations) {
        const orders = await this.orderService.findAllByOrganization(organization.organization_id, {
          period: { date_start: reportFilter.period.period_start, date_end: reportFilter.period.period_end },
        })

        const allCount = orders.data.length

        const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5)
        const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

        const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
        const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

        organizationReport.push({
          organization: organization,
          all_count: allCount,
          completed_count: completed.length,
          completed_percent: completedPercent,
          checked_count: checked.length,
          checked_percent: checkedPercent,
        })
      }

      const filtered = organizationReport.filter(
        (report) =>
          (reportFilter?.filter?.report?.completed_count != null ? report.completed_count > reportFilter.filter.report.completed_count : true) &&
          (reportFilter?.filter?.report?.completed_percent != null ? report.completed_percent > reportFilter.filter.report.completed_percent : true) &&
          (reportFilter?.filter?.report?.checked_count != null ? report.checked_count > reportFilter.filter.report.checked_count : true) &&
          (reportFilter?.filter?.report?.checked_percent != null ? report.checked_percent > reportFilter.filter.report.checked_percent : true) &&
          (reportFilter?.filter?.organization?.organization_id != null
            ? report.organization.organization_id === reportFilter.filter.organization.organization_id
            : true) &&
          (reportFilter?.filter?.organization?.full_name != null ? report.organization.full_name === reportFilter.filter.organization.full_name : true),
      )

      const sorted = filtered.sort(
        (report1, report2) =>
          (reportFilter?.sorts?.report?.completed_count == 'DESC'
            ? report2.completed_count - report1.completed_count
            : reportFilter?.sorts?.report?.completed_count
              ? report1.completed_count - report2.completed_count
              : 0) +
          (reportFilter?.sorts?.report?.completed_percent == 'DESC'
            ? report2.completed_percent - report1.completed_percent
            : reportFilter?.sorts?.report?.completed_percent
              ? report1.completed_percent - report2.completed_percent
              : 0) +
          (reportFilter?.sorts?.report?.checked_count == 'DESC'
            ? report2.checked_count - report1.checked_count
            : reportFilter?.sorts?.report?.checked_count
              ? report1.checked_count - report2.checked_count
              : 0) +
          (reportFilter?.sorts?.report?.checked_percent == 'DESC'
            ? report2.checked_percent - report1.checked_percent
            : reportFilter?.sorts?.report?.checked_percent
              ? report1.checked_percent - report2.checked_percent
              : 0) +
          (reportFilter?.sorts?.organization?.organization_id == 'DESC'
            ? report2.organization.organization_id - report1.organization.organization_id
            : reportFilter?.sorts?.organization?.organization_id
              ? report1.organization.organization_id - report2.organization.organization_id
              : 0) +
          (reportFilter?.sorts?.organization?.full_name == 'DESC'
            ? report2.organization.full_name.localeCompare(report1.organization.full_name)
            : reportFilter?.sorts?.organization?.full_name
              ? report1.organization.full_name.localeCompare(report2.organization.full_name)
              : 0),
      )

      const result = sorted.splice(offset_count * (offset_page - 1), offset_count)
      return { count: organizationReport.length, data: result }
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }
}
