import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Person } from './entities/person.entity';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { PersonSeeds } from './seeds';

@Module({
  imports: [
    SequelizeModule.forFeature([Person]),
    SeederModule.forFeature([PersonSeeds]),
  ],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
