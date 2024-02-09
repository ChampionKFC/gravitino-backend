import { Injectable } from '@nestjs/common'
import { CreatePersonDto, UpdatePersonDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Person } from './entities/person.entity'
import { ArrayPersonResponse, PersonResponse, StatusPersonResponse } from './response'
import { PersonFilter } from './filters'
import { Sequelize } from 'sequelize-typescript'
import { QueryTypes } from 'sequelize'
import { generateWhereQuery, generateSortQuery } from 'src/common/utlis/generate_sort_query'

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person) private personRepository: typeof Person,
    private readonly sequelize: Sequelize,
  ) {}

  async create(person: CreatePersonDto): Promise<PersonResponse> {
    try {
      const newPerson = await this.personRepository.create({ ...person })
      return newPerson
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(personFilter: PersonFilter): Promise<ArrayPersonResponse> {
    try {
      const offset_count = personFilter.offset?.count == undefined ? 50 : personFilter.offset.count
      const offset_page = personFilter.offset?.page == undefined ? 1 : personFilter.offset.page

      let whereQuery = ''
      if (personFilter?.filter) {
        whereQuery = generateWhereQuery(personFilter?.filter)
      }
      let sortQuery = ''
      if (personFilter?.sorts) {
        sortQuery = generateSortQuery(personFilter?.sorts)
      }

      const selectQuery = `
        SELECT
          "person_id",
          "last_name",
          "first_name",
          "patronymic",
          "phone",
          "property_values",
          "createdAt",
          "updatedAt"
        FROM
          "People" AS "Person"
        ${whereQuery}
        ${sortQuery}
      `

      const count = (
        await this.sequelize.query<Person>(selectQuery, {
          nest: true,
          type: QueryTypes.SELECT,
        })
      ).length
      const foundPerson = await this.sequelize.query<Person>(
        `
          ${selectQuery}
          LIMIT ${offset_count} OFFSET ${(offset_page - 1) * offset_count};
        `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      )

      return { count: count, data: foundPerson }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(person_id: number): Promise<boolean> {
    try {
      const result = await this.personRepository.findOne({
        where: { person_id },
      })

      if (result) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedPerson: UpdatePersonDto) {
    try {
      await this.personRepository.update({ ...updatedPerson }, { where: { person_id: updatedPerson.person_id } })
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(person_id: number): Promise<StatusPersonResponse> {
    try {
      const deletePerson = await this.personRepository.destroy({
        where: { person_id },
      })

      if (deletePerson) {
        return { status: true }
      }

      return { status: false }
    } catch (error) {
      throw new Error(error)
    }
  }
}
