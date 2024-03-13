import { Module } from '@nestjs/common'
import { PeriodicityService } from './periodicity.service'
import { PeriodicityController } from './periodicity.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Periodicity } from './entities/periodicity.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [SequelizeModule.forFeature([Periodicity]), UsersModule],
  controllers: [PeriodicityController],
  providers: [PeriodicityService],
  exports: [PeriodicityService],
})
export class PeriodicityModule {}
