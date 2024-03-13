import { ForbiddenException, Inject, Injectable, forwardRef } from '@nestjs/common'
import { ArrayBranchReportResponse, ArrayCheckpointReportResponse, ArrayOrganizationsReportResponse, CheckpointReportResponse } from './response'
import { OrderService } from '../order/order.service'
import { BranchService } from '../branch/branch.service'
import { CheckpointService } from '../checkpoint/checkpoint.service'
import { FacilityService } from '../facility/facility.service'
import { BranchReportFilter, CheckpointReportFilter, OrganizationReportFilter } from './filters'
import { QueryTypes } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { User } from '../users/entities/user.entity'
import { UserRoles } from 'src/common/constants/constants'
import { AppError } from 'src/common/constants/error'

@Injectable()
export class ReportService {
  constructor(
    private readonly orderService: OrderService,
    private readonly branchService: BranchService,
    @Inject(forwardRef(() => CheckpointService)) private readonly checkpointService: CheckpointService,
    @Inject(forwardRef(() => FacilityService)) private readonly facilityService: FacilityService,
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

        const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5 || order.order_status_id === 7)
        const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

        const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
        const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

        branchReport.push({
          branch: branch,
          all_count: allCount,
          completed_count: completed.length,
          completed_percent: allCount == 0 ? 0 : completedPercent.toPrecision(3),
          checked_count: checked.length,
          checked_percent: completed.length == 0 ? 0 : checkedPercent.toPrecision(3),
        })
      }

      const filtered = branchReport.filter((report) => {
        const minCompletedCountFilter = reportFilter?.filter?.report?.min_completed_count ?? -1
        const maxCompletedCountFilter = reportFilter?.filter?.report?.max_completed_count ?? Infinity
        const minCompletedPercentFilter = reportFilter?.filter?.report?.min_completed_percent ?? -1
        const maxCompletedPercentFilter = reportFilter?.filter?.report?.max_completed_percent ?? Infinity
        const minCheckedCountFilter = reportFilter?.filter?.report?.min_checked_count ?? -1
        const maxCheckedCountFilter = report?.max_checked_count ?? Infinity
        const minCheckedPercentFilter = reportFilter?.filter?.report?.min_checked_percent ?? -1
        const maxCheckedPercentFilter = reportFilter?.filter?.report?.max_checked_percent ?? Infinity

        return (
          report.completed_count >= minCompletedCountFilter &&
          report.completed_count <= maxCompletedCountFilter &&
          Number(report.completed_percent) >= minCompletedPercentFilter &&
          Number(report.completed_percent) <= maxCompletedPercentFilter &&
          report.checked_count >= minCheckedCountFilter &&
          report.checked_count <= maxCheckedCountFilter &&
          Number(report.checked_percent) >= minCheckedPercentFilter &&
          Number(report.checked_percent) <= maxCheckedPercentFilter &&
          (reportFilter?.filter?.branch?.branch_id != null ? report.branch.branch_id === reportFilter.filter.branch.branch_id : true) &&
          (reportFilter?.filter?.branch?.branch_name != null ? report.branch.branch_name === reportFilter.filter.branch.branch_name : true) &&
          (reportFilter?.filter?.branch?.branch_address != null ? report.branch.branch_address === reportFilter.filter.branch.branch_address : true)
        )
      })

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

        const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5 || order.order_status_id === 7)
        const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

        const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
        const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

        checkpointReport.push({
          checkpoint: checkpoint,
          all_count: allCount,
          completed_count: completed.length,
          completed_percent: allCount == 0 ? 0 : completedPercent.toPrecision(3),
          checked_count: checked.length,
          checked_percent: completed.length == 0 ? 0 : checkedPercent.toPrecision(3),
        })
      }

      const filtered = checkpointReport.filter((report) => {
        const minCompletedCountFilter = reportFilter?.filter?.report?.min_completed_count ?? -1
        const maxCompletedCountFilter = reportFilter?.filter?.report?.max_completed_count ?? Infinity
        const minCompletedPercentFilter = reportFilter?.filter?.report?.min_completed_percent ?? -1
        const maxCompletedPercentFilter = reportFilter?.filter?.report?.max_completed_percent ?? Infinity
        const minCheckedCountFilter = reportFilter?.filter?.report?.min_checked_count ?? -1
        const maxCheckedCountFilter = report?.max_checked_count ?? Infinity
        const minCheckedPercentFilter = reportFilter?.filter?.report?.min_checked_percent ?? -1
        const maxCheckedPercentFilter = reportFilter?.filter?.report?.max_checked_percent ?? Infinity

        return (
          report.completed_count >= minCompletedCountFilter &&
          report.completed_count <= maxCompletedCountFilter &&
          Number(report.completed_percent) >= minCompletedPercentFilter &&
          Number(report.completed_percent) <= maxCompletedPercentFilter &&
          report.checked_count >= minCheckedCountFilter &&
          report.checked_count <= maxCheckedCountFilter &&
          Number(report.checked_percent) >= minCheckedPercentFilter &&
          Number(report.checked_percent) <= maxCheckedPercentFilter &&
          (reportFilter?.filter?.checkpoint?.checkpoint_id != null ? report.checkpoint.checkpoint_id === reportFilter.filter.checkpoint.checkpoint_id : true) &&
          (reportFilter?.filter?.checkpoint?.checkpoint_name != null
            ? report.checkpoint.checkpoint_name === reportFilter.filter.checkpoint.checkpoint_name
            : true) &&
          (reportFilter?.filter?.checkpoint?.neighboring_state.neighboring_state_id != null
            ? report.checkpoint.neighboring_state.neighboring_state_id === reportFilter.filter.checkpoint.neighboring_state.neighboring_state_id
            : true) &&
          (reportFilter?.filter?.checkpoint?.neighboring_state.neighboring_state_name != null
            ? report.checkpoint.neighboring_state.neighboring_state_name === reportFilter.filter.checkpoint.neighboring_state.neighboring_state_name
            : true)
        )
      })

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

  async generateMyBranchReport(reportFilter: CheckpointReportFilter, user_id: number): Promise<ArrayCheckpointReportResponse> {
    try {
      const foundUser = await this.sequelize.query<User>(
        `
          SELECT "user"."user_id",
                 "user"."role_id",
                 "group"."branch_id" AS "group.branch_id"
          FROM "Users" AS "user"
          LEFT JOIN "Groups" AS "group" 
          ON "user"."group_id" = "group"."group_id"
          WHERE "user"."user_id" = :user_id;
      `,
        {
          nest: true,
          plain: true,
          type: QueryTypes.SELECT,
          replacements: {
            user_id: user_id,
          },
        },
      )

      if (foundUser.role_id == UserRoles.BRANCH_WORKER && foundUser.group.branch_id) {
        const report = await this.generateCheckpointReport(foundUser.group.branch_id.toString(), reportFilter)
        return report
      } else {
        throw new ForbiddenException(AppError.FORBIDDEN_RESOURCE)
      }
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }

  async generateBranchOrganizationReport(branch_id: string, reportFilter: OrganizationReportFilter): Promise<ArrayOrganizationsReportResponse> {
    try {
      const organizations = await this.facilityService.findOrganizationsByBranch(branch_id, false)

      return await this.generateOrganizationReport(organizations, reportFilter)
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }

  async generateCheckpointOrganizationReport(checkpoint_id: string, reportFilter: OrganizationReportFilter): Promise<ArrayOrganizationsReportResponse> {
    try {
      const organizations = await this.facilityService.findOrganizationsByCheckpoint(checkpoint_id, false)

      return await this.generateOrganizationReport(organizations, reportFilter)
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }

  async generateFacilityOrganizationReport(facility_id: string, reportFilter: OrganizationReportFilter): Promise<ArrayOrganizationsReportResponse> {
    try {
      const organizations = await this.facilityService.findOrganizationsByFacility(+facility_id, false)

      return await this.generateOrganizationReport(organizations, reportFilter)
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }

  async generateOrganizationReport(organizations: any[], reportFilter: OrganizationReportFilter): Promise<ArrayOrganizationsReportResponse> {
    const offset_count = reportFilter.offset?.count == undefined ? 50 : reportFilter.offset.count
    const offset_page = reportFilter.offset?.page == undefined ? 1 : reportFilter.offset.page
    const organizationReport = []

    for (const organization of organizations) {
      const orders = await this.orderService.findAllByOrganization(organization.organization_id, {
        period: { date_start: reportFilter.period.period_start, date_end: reportFilter.period.period_end },
      })

      const allCount = orders.data.length

      const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5 || order.order_status_id === 7)
      const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

      const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
      const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

      organizationReport.push({
        organization: organization,
        all_count: allCount,
        completed_count: completed.length,
        completed_percent: allCount == 0 ? 0 : completedPercent.toPrecision(3),
        checked_count: checked.length,
        checked_percent: completed.length == 0 ? 0 : checkedPercent.toPrecision(3),
      })
    }

    const filtered = organizationReport.filter((report) => {
      const minCompletedCountFilter = reportFilter?.filter?.report?.min_completed_count ?? -1
      const maxCompletedCountFilter = reportFilter?.filter?.report?.max_completed_count ?? Infinity
      const minCompletedPercentFilter = reportFilter?.filter?.report?.min_completed_percent ?? -1
      const maxCompletedPercentFilter = reportFilter?.filter?.report?.max_completed_percent ?? Infinity
      const minCheckedCountFilter = reportFilter?.filter?.report?.min_checked_count ?? -1
      const maxCheckedCountFilter = report?.max_checked_count ?? Infinity
      const minCheckedPercentFilter = reportFilter?.filter?.report?.min_checked_percent ?? -1
      const maxCheckedPercentFilter = reportFilter?.filter?.report?.max_checked_percent ?? Infinity

      return (
        report.completed_count >= minCompletedCountFilter &&
        report.completed_count <= maxCompletedCountFilter &&
        Number(report.completed_percent) >= minCompletedPercentFilter &&
        Number(report.completed_percent) <= maxCompletedPercentFilter &&
        report.checked_count >= minCheckedCountFilter &&
        report.checked_count <= maxCheckedCountFilter &&
        Number(report.checked_percent) >= minCheckedPercentFilter &&
        Number(report.checked_percent) <= maxCheckedPercentFilter &&
        (reportFilter?.filter?.organization?.organization_id != null
          ? report.organization.organization_id === reportFilter.filter.organization.organization_id
          : true) &&
        (reportFilter?.filter?.organization?.full_name != null ? report.organization.full_name === reportFilter.filter.organization.full_name : true)
      )
    })

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
  }

  async generateMyOrganizationsReport(reportFilter: OrganizationReportFilter, user_id: number): Promise<ArrayOrganizationsReportResponse> {
    try {
      const foundUser = await this.sequelize.query<User>(
        `
          SELECT "user"."user_id",
                 "user"."role_id",
                 "group"."branch_id" AS "group.branch_id",
                 "group"."checkpoint_id" AS "group.checkpoint_id",
                 "group"."facility_id" AS "group.facility_id"
          FROM "Users" AS "user"
          LEFT JOIN "Groups" AS "group" 
          ON "user"."group_id" = "group"."group_id"
          WHERE "user"."user_id" = :user_id;
      `,
        {
          nest: true,
          plain: true,
          type: QueryTypes.SELECT,
          replacements: {
            user_id: user_id,
          },
        },
      )

      if (foundUser.role_id == UserRoles.BRANCH_WORKER && foundUser.group.branch_id) {
        const report = await this.generateBranchOrganizationReport(foundUser.group.branch_id.toString(), reportFilter)
        return report
      } else if (
        (foundUser.role_id == UserRoles.CHECKPOINT_WORKER || foundUser.role_id == UserRoles.CHECKPOINT_CHIEF_ENGINEER) &&
        foundUser.group.checkpoint_id
      ) {
        const report = await this.generateCheckpointOrganizationReport(foundUser.group.checkpoint_id.toString(), reportFilter)
        return report
      } else if (foundUser.group.facility_id) {
        const report = await this.generateFacilityOrganizationReport(foundUser.group.facility_id.toString(), reportFilter)
        return report
      } else {
        throw new ForbiddenException(AppError.FORBIDDEN_RESOURCE)
      }
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }

  async generateOneCheckpointReport(checkpoint_id: number): Promise<CheckpointReportResponse> {
    try {
      const orders = await this.orderService.findAllByCheckpoint([checkpoint_id], {})

      const allCount = orders.data.length

      const completed = orders.data.filter((order) => order.order_status_id === 4 || order.order_status_id === 5 || order.order_status_id === 7)
      const checked = orders.data.filter((order) => order.order_status_id === 5 || order.order_status_id === 7)

      const completedPercent = (completed.length / allCount) * 100 // Процент отправленных и непроверенных задач (отношение completed к all)
      const checkedPercent = (checked.length / completed.length) * 100 // Процент проверенных задач (отношение checked к completed)

      return {
        all_count: allCount,
        completed_count: completed.length,
        completed_percent: allCount == 0 ? '0.0' : completedPercent.toPrecision(3),
        checked_count: checked.length,
        checked_percent: completed.length == 0 ? '0.0' : checkedPercent.toPrecision(3),
      }
    } catch (error) {
      console.log('REPORT:', error)
      throw new Error(error)
    }
  }
}
