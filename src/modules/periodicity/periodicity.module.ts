import { Module } from '@nestjs/common'
import { PeriodicityService } from './periodicity.service'
import { PeriodicityController } from './periodicity.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Periodicity } from './entities/periodicity.entity'
import { SeederModule } from 'nestjs-sequelize-seeder'
import { PeriodicitySeeds } from './seeds'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [SequelizeModule.forFeature([Periodicity]), UsersModule, SeederModule.forFeature([PeriodicitySeeds])],
  controllers: [PeriodicityController],
  providers: [PeriodicityService],
  exports: [PeriodicityService],
})
export class PeriodicityModule {}
