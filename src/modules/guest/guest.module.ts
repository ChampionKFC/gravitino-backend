import { Module } from '@nestjs/common'
import { GuestService } from './guest.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Guest } from './entities/guest.entity'

@Module({
  imports: [SequelizeModule.forFeature([Guest])],
  providers: [GuestService],
  exports: [GuestService],
})
export class GuestModule {}
