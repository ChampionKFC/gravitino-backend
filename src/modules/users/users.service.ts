import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { CreateUserDto, CreateUserOrganizationDto, UpdateUserDto, UpdateUserOrganizationDto, UpdateUserStatusDto } from './dto'
import { Role } from 'src/modules/roles/entities/role.entity'
import * as bcrypt from 'bcrypt'
import { Organization } from 'src/modules/organization/entities/organization.entity'
import { InjectModel } from '@nestjs/sequelize'
import { Person } from 'src/modules/person/entities/person.entity'
import { CreatePersonDto, UpdatePersonDto } from 'src/modules/person/dto'
import { Group } from 'src/modules/group/entities/group.entity'
import { Sequelize } from 'sequelize-typescript'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { AppError } from 'src/common/constants/error'
import { Op, QueryTypes } from 'sequelize'
import { ArrayUserResponse, StatusUserResponse, UserResponse } from './response'
import { UserFilter } from './filters'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'
import { OrganizationService } from '../organization/organization.service'
import { CreateOrganizationDto, UpdateOrganizationDto } from '../organization/dto'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Person) private personRepository: typeof Person,
    @InjectModel(Organization) private organizationRepository: typeof Organization,
    private readonly organizationService: OrganizationService,
    private readonly historyService: TransactionHistoryService,
    private sequelize: Sequelize,
  ) {}

  async create(user: CreateUserDto): Promise<StatusUserResponse> {
    try {
      const transaction = await this.sequelize.transaction()

      const email = user.email.toLowerCase()
      user.email = email
      user.password = await bcrypt.hash(user.password, 10)

      if (user.last_name && user.first_name && user.phone) {
        const createPersonDto = new CreatePersonDto()
        createPersonDto.last_name = user.last_name
        createPersonDto.first_name = user.first_name
        createPersonDto.patronymic = user.patronymic
        createPersonDto.phone = user.phone

        const newPerson = await this.personRepository.create({ ...createPersonDto }, { transaction: transaction })

        user.person_id = newPerson.person_id
      }

      const newUser = await this.userRepository.create({ ...user }, { transaction: transaction }).catch((error) => {
        let errorMessage = error.message
        let errorCode = HttpStatus.BAD_REQUEST
        if (error.original.code === '23505') {
          errorMessage = AppError.USER_EMAIL_EXISTS
          errorCode = HttpStatus.CONFLICT
        }

        throw new HttpException(errorMessage, errorCode)
      })

      await transaction.commit()

      const historyDto = {
        user_id: newUser.user_id,
        comment: `${AppStrings.HISTORY_USER_CREATED}${newUser.user_id} (person_id: ${newUser.person_id})`,
      }
      await this.historyService.create(historyDto)

      return {
        status: true,
        data: {
          user_id: newUser.user_id,
          ...user,
          is_active: true,
        },
      }
    } catch (error) {
      if (error.code === 409) {
        throw new Error(error.message)
      } else {
        throw new Error(error)
      }
    }
  }

  async createOrganization(organization: CreateUserOrganizationDto): Promise<StatusUserResponse> {
    try {
      const transaction = await this.sequelize.transaction()

      const email = organization.email.toLowerCase()
      organization.email = email
      organization.password = await bcrypt.hash(organization.password, 10)

      const createOrganizationDto = new CreateOrganizationDto()
      createOrganizationDto.organization_type_id = organization.organization_type_id
      createOrganizationDto.full_name = organization.full_name
      createOrganizationDto.short_name = organization.short_name
      createOrganizationDto.phone = organization.phone

      const newOrganization = await this.organizationRepository.create({ ...createOrganizationDto }, { transaction: transaction })
      organization.organization_id = newOrganization.organization_id

      const newUser = await this.userRepository.create({ ...organization }, { transaction: transaction })

      const historyDto = {
        user_id: newUser.user_id,
        comment: `${AppStrings.HISTORY_USER_ORGANIZATION_CREATED}${newUser.user_id} (organization_id: ${newUser.organization_id})`,
      }
      await this.historyService.create(historyDto, transaction)

      await transaction.commit()

      return {
        status: true,
        data: {
          user_id: newUser.user_id,
          ...organization,
          is_active: true,
        },
      }
    } catch (error) {
      if (error.code === 409) {
        throw new Error(error.message)
      } else {
        throw new Error(error)
      }
    }
  }

  async update(updatedUser: UpdateUserDto, user_id: number): Promise<UserResponse> {
    try {
      const transaction = await this.sequelize.transaction()

      if (updatedUser.email != undefined) {
        const email = updatedUser.email.toLowerCase()
        updatedUser.email = email
      }

      if (updatedUser.password != undefined) {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10)
      }

      const user = await this.findById(updatedUser.user_id)
      const person_id = user.person.person_id
      const foundPerson = await this.personRepository.findOne({
        where: { person_id },
      })
      if (foundPerson == null) {
        await transaction.rollback()
        throw new HttpException(AppError.PERSON_NOT_FOUND, HttpStatus.BAD_REQUEST)
      }

      const updatePersonDto = new UpdatePersonDto()
      updatePersonDto.last_name = updatedUser.last_name
      updatePersonDto.first_name = updatedUser.first_name
      updatePersonDto.patronymic = updatedUser.patronymic
      updatePersonDto.phone = updatedUser.phone

      await foundPerson.update(updatePersonDto, { transaction: transaction })

      let foundUser = null
      await this.userRepository.update({ ...updatedUser }, { where: { user_id: updatedUser.user_id }, transaction: transaction })

      foundUser = await this.userRepository.findOne({
        where: { user_id: updatedUser.user_id },
      })

      if (foundUser) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_USER_UPDATED}${foundUser.user_id}`,
        }
        await this.historyService.create(historyDto)
      }

      await transaction.commit()

      return foundUser
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateOrganization(organization: UpdateUserOrganizationDto, user_id: number): Promise<StatusUserResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      if (organization.email != undefined) {
        const email = organization.email.toLowerCase()
        organization.email = email
      }

      if (organization.password != undefined) {
        organization.password = await bcrypt.hash(organization.password, 10)
      }

      const user = await this.findById(organization.user_id)
      const organization_id = user.organization.organization_id
      const foundOrganization = await this.organizationRepository.findOne({
        where: { organization_id },
      })
      if (!foundOrganization) {
        await transaction.rollback()
        throw new HttpException(AppError.PERSON_NOT_FOUND, HttpStatus.BAD_REQUEST)
      }

      const updateOrganizationDto = new UpdateOrganizationDto()
      updateOrganizationDto.organization_type_id = organization.organization_type_id
      updateOrganizationDto.full_name = organization.full_name
      updateOrganizationDto.short_name = organization.short_name
      updateOrganizationDto.phone = organization.phone

      await foundOrganization.update(updateOrganizationDto, { transaction: transaction })

      const updateUserOrganization = await this.userRepository.update(
        { ...organization },
        { where: { user_id: organization.user_id }, transaction: transaction },
      )

      if (updateUserOrganization) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_USER_ORGANIZATION_UPDATED}${organization.user_id}`,
        }
        await this.historyService.create(historyDto, transaction)

        await transaction.commit()
        return { status: true }
      } else {
        await transaction.rollback()
        return { status: false }
      }
    } catch (error) {
      await transaction.rollback()
      throw new Error(error)
    }
  }

  async findAll(userFilter: UserFilter): Promise<ArrayUserResponse> {
    try {
      const offset_count = userFilter.offset?.count == undefined ? 50 : userFilter.offset.count
      const offset_page = userFilter.offset?.page == undefined ? 1 : userFilter.offset.page

      let whereQuery = ''
      if (userFilter?.filter) {
        whereQuery = generateWhereQuery(userFilter?.filter)
      }
      let sortQuery = ''
      if (userFilter?.sorts) {
        sortQuery = generateSortQuery(userFilter?.sorts)
      }

      const foundUsers = await this.sequelize.query<User>(
        `
        SELECT *
        FROM (
          SELECT
            "User"."user_id",
            "User"."email",
            "User"."is_active",
            "User"."createdAt",
            "User"."updatedAt",
            "role"."role_id" AS "role.role_id",
            "role"."role_name" AS "role.role_name",
            "organization"."organization_id" AS "organization.organization_id",
            "organization_type"."organization_type_id" AS "organization.organization_type.organization_type_id",
            "organization_type"."organization_type_name" AS "organization.organization_type.organization_type_name",
            "organization"."full_name" AS "organization.full_name",
            "organization"."short_name" AS "organization.short_name",
            "organization"."phone" AS "organization.phone",
            "organization"."property_values" AS "organization.property_values",
            "person"."person_id" AS "person.person_id",
            "person"."last_name" AS "person.last_name",
            "person"."first_name" AS "person.first_name",
            "person"."patronymic" AS "person.patronymic",
            "person"."phone" AS "person.phone",
            "person"."property_values" AS "person.property_values",
            "group"."group_id" AS "group.group_id",
            "group"."group_name" AS "group.group_name",
            "group"."branch_id" AS "group.branch_id",
            "group"."checkpoint_id" AS "group.checkpoint_id",
            "group"."facility_id" AS "group.facility_id"
          FROM
            "Users" AS "User"
            LEFT OUTER JOIN "Roles" AS "role" ON "User"."role_id" = "role"."role_id"
            LEFT OUTER JOIN "Organizations" AS "organization" ON "User"."organization_id" = "organization"."organization_id"
            LEFT OUTER JOIN "OrganizationTypes" AS "organization_type" ON "organization"."organization_type_id" = "organization_type"."organization_type_id"
            LEFT OUTER JOIN "People" AS "person" ON "User"."person_id" = "person"."person_id"
            LEFT OUTER JOIN "Groups" AS "group" ON "User"."group_id" = "group"."group_id"
        )
        ${whereQuery}
        ${sortQuery}
        LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )
      return { count: foundUsers.length, data: foundUsers }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(user_id: number): Promise<boolean> {
    try {
      const result = await this.userRepository.findOne({ where: { user_id } })

      if (result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findById(id: number) {
    const result = await this.userRepository.findOne({
      include: [Role, Organization, Person, Group],
      where: { user_id: id },
      attributes: {
        exclude: ['password', 'organization_id', 'role_id', 'person_id', 'group_id'],
      },
    })

    if (result != null) {
      return result
    } else {
      return Promise.reject({
        statusCode: HttpStatus.NOT_FOUND,
        message: AppError.USER_NOT_FOUND,
      })
    }
  }

  async findUser({ user_id = -1, email = '' }: { user_id?: number; email?: string }): Promise<boolean> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { [Op.or]: [{ user_id }, { email }] },
      })

      if (foundUser) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const result = await this.userRepository.findOne({
        include: [Person],
        where: { email },
        attributes: { exclude: ['person_id'] },
      })

      console.log(result)

      if (result != null) {
        // const userRoles = await this.rolePermissionRepository.findAll({
        //   where: { role_id: result.role_id },
        //   attributes: {
        //     exclude: [
        //       'role_permission_id',
        //       'role_id',
        //       'createdAt',
        //       'updatedAt',
        //     ],
        //   },
        // });
        // const permissions = [];
        // userRoles.forEach(element => {
        //     permissions.push(element.dataValues);
        // });

        return {
          user_id: result.user_id,
          email: result.email,
          password: result.password,
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(id: number, user_id: number): Promise<StatusUserResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
        attributes: { exclude: ['password'] },
      })

      const deleteUser = await this.userRepository.destroy({
        where: { user_id: id },
        transaction: transaction,
      })
      let deleteData = null
      if (user.person_id) {
        deleteData = await this.personRepository.destroy({
          where: { person_id: user.person_id },
          transaction: transaction,
        })
      } else {
        deleteData = await this.organizationRepository.destroy({
          where: { organization_id: user.organization_id },
          transaction: transaction,
        })
      }

      if (deleteUser && deleteData) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_USER_DELETED}${id}`,
        }
        await this.historyService.create(historyDto, transaction)
        await transaction.commit()

        return { status: true }
      } else {
        await transaction.rollback()
        return { status: false }
      }
    } catch (error) {
      await transaction.rollback()
      throw new Error(error)
    }
  }

  async changeStatus(updateUserStatusDto: UpdateUserStatusDto, user_id: number): Promise<StatusUserResponse> {
    const transaction = await this.sequelize.transaction()
    try {
      await this.userRepository.update({ is_active: updateUserStatusDto.is_active }, { where: { user_id: updateUserStatusDto.user_id } })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.USER_STATUS} #${updateUserStatusDto.user_id} ${AppStrings.HISTORY_UPDATED} ${updateUserStatusDto.is_active}`,
      }
      await this.historyService.create(historyDto)

      await transaction.commit()
      return { status: true }
    } catch (error) {
      await transaction.rollback()
      throw new Error(error)
    }
  }
}
