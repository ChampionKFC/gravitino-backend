import { Injectable } from '@nestjs/common'
import { Guest } from './entities/guest.entity'
import { InjectModel } from '@nestjs/sequelize'
import { CreateGuestDto } from './dto'
import { StatusGuestResponse } from './response'
import { Transaction } from 'sequelize'

@Injectable()
export class GuestService {
  constructor(@InjectModel(Guest) private guestRepository: typeof Guest) {}

  async create(guest: CreateGuestDto, transaction: Transaction): Promise<StatusGuestResponse> {
    try {
      const newGuest = await this.guestRepository.create({ ...guest }, { transaction })

      return { status: true, data: newGuest }
    } catch (error) {
      throw new Error(error)
    }
  }
}
