import { Injectable } from '@nestjs/common';
import { CreateFacilityDto, UpdateFacilityDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Facility } from './entities/facility.entity';
import { TransactionHistoryService } from '../transaction_history/transaction_history.service';
import { FacilityResponse, StatusFacilityResponse } from './response';
import { FacilityFilter } from './filters';
import { QueryTypes } from 'sequelize';
import {
  generateWhereQuery,
  generateSortQuery,
} from 'src/common/utlis/generate_sort_query';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility) private facilityRepository: typeof Facility,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    facility: CreateFacilityDto,
    user_id: number,
  ): Promise<StatusFacilityResponse> {
    try {
      const newFacility = await this.facilityRepository.create({ ...facility });

      const historyDto = {
        user_id: user_id,
        comment: `Создан объект обслуживания #${newFacility.facility_id}`,
      };
      await this.historyService.create(historyDto);

      return { status: true, data: newFacility };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(facilityFilter?: FacilityFilter): Promise<FacilityResponse[]> {
    try {
      const offset_count =
        facilityFilter.offset?.count == undefined
          ? 50
          : facilityFilter.offset.count;
      const offset_page =
        facilityFilter.offset?.page == undefined
          ? 1
          : facilityFilter.offset.page;

      let whereQuery = '';
      if (facilityFilter?.filter) {
        whereQuery = generateWhereQuery(facilityFilter?.filter);
      }
      let sortQuery = '';
      if (facilityFilter?.sorts) {
        sortQuery = generateSortQuery(facilityFilter?.sorts);
      }

      const result = this.sequelize.query<Facility>(
        `
        SELECT * FROM (
          SELECT
            "Facility"."facility_id",
            "Facility"."facility_name",
            "Facility"."organization_id",
            "Facility"."createdAt",
            "Facility"."updatedAt",
            "checkpoint"."checkpoint_id" AS "checkpoint.checkpoint_id",
            "checkpoint"."checkpoint_name" AS "checkpoint.checkpoint_name",
            "checkpoint"."address" AS "checkpoint.address",
            "branch"."branch_id" AS "checkpoint.branch.branch_id",
            "branch"."branch_name" AS "checkpoint.branch.branch_name",
            "branch"."branch_address" AS "checkpoint.branch.branch_address",
            "checkpoint"."neighboring_state" AS "checkpoint.neighboring_state",
            "checkpoint"."district" AS "checkpoint.district",
            "checkpoint"."region" AS "checkpoint.region",
            "checkpoint_type"."checkpoint_type_id" AS "checkpoint.checkpoint_type.checkpoint_type_id",
            "checkpoint_type"."checkpoint_type_name" AS "checkpoint.checkpoint_type.checkpoint_type_name",
            "checkpoint"."working_hours" AS "checkpoint.working_hours",
            "checkpoint"."operating_mode" AS "checkpoint.operating_mode",
            "checkpoint"."property_values" AS "checkpoint.property_values",
            "organization"."organization_id" AS "organization.organization_id",
            "organization_type"."organization_type_id" AS "organization.organization_type.organization_type_id",
            "organization_type"."organization_type_name" AS "organization.organization_type.organization_type_name",
            "organization"."full_name" AS "organization.full_name",
            "organization"."short_name" AS "organization.short_name",
            "organization"."register_number" AS "organization.register_number",
            "organization"."phone" AS "organization.phone",
            "organization"."email" AS "organization.email",
            "organization"."property_values" AS "organization.property_values"
          FROM
            "Facilities" AS "Facility"
            LEFT JOIN "Checkpoints" AS "checkpoint" ON "Facility"."checkpoint_id" = "checkpoint"."checkpoint_id"
            LEFT JOIN "CheckpointTypes" AS "checkpoint_type" ON "checkpoint"."checkpoint_type_id" = "checkpoint_type"."checkpoint_type_id"
            LEFT JOIN "Branches" AS "branch" ON "checkpoint"."branch_id" = "branch"."branch_id"
            LEFT JOIN "Organizations" AS "organization" ON "Facility"."organization_id" = "organization"."organization_id"
            LEFT JOIN "OrganizationTypes" AS "organization_type" ON "organization"."organization_type_id" = "organization_type"."organization_type_id"
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

  async findOne(facility_id: number): Promise<boolean> {
    try {
      const result = await this.facilityRepository.findOne({
        where: { facility_id },
      });

      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByBranch(branch_ids: number[], facilityFilter: FacilityFilter) {
    try {
      let result = [];

      if (!facilityFilter.filter) {
        facilityFilter.filter = {};
      }

      for (let index = 0; index < branch_ids.length; index++) {
        const id = branch_ids[index];

        facilityFilter.filter.checkpoint = {
          branch: { branch_id: +id },
        };
        result = [...result, ...(await this.findAll(facilityFilter))];
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByCheckpoint(
    checkpoint_ids: number[],
    facilityFilter: FacilityFilter,
  ) {
    try {
      let result = [];

      if (!facilityFilter.filter) {
        facilityFilter.filter = {};
      }

      for (let index = 0; index < checkpoint_ids.length; index++) {
        const id = checkpoint_ids[index];

        facilityFilter.filter.checkpoint = { checkpoint_id: +id };
        result = [...result, ...(await this.findAll(facilityFilter))];
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    updatedFacility: UpdateFacilityDto,
    user_id: number,
  ): Promise<FacilityResponse> {
    try {
      await this.facilityRepository.update(
        { ...updatedFacility },
        { where: { checkpoint_id: updatedFacility.facility_id } },
      );

      const foundFacility = await this.facilityRepository.findOne({
        where: { checkpoint_id: updatedFacility.facility_id },
      });

      if (foundFacility) {
        const historyDto = {
          user_id: user_id,
          comment: `Изменен объект обслуживания #${foundFacility.facility_id}`,
        };
        await this.historyService.create(historyDto);
      }

      return foundFacility;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(
    facility_id: number,
    user_id: number,
  ): Promise<StatusFacilityResponse> {
    try {
      const deleteFacility = await this.facilityRepository.destroy({
        where: { facility_id },
      });

      if (deleteFacility) {
        const historyDto = {
          user_id: user_id,
          comment: `Удален объект обслуживания #${facility_id}`,
        };
        await this.historyService.create(historyDto);

        return { status: true };
      }

      return { status: false };
    } catch (error) {
      throw new Error(error);
    }
  }
}