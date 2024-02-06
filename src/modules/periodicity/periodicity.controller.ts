import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PeriodicityService } from './periodicity.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { PeriodicityFilter } from './filters';
import { Periodicity } from './entities/periodicity.entity';

@ApiBearerAuth()
@Controller('periodicity')
@ApiTags('Periodicity')
export class PeriodicityController {
  constructor(private readonly periodicityService: PeriodicityService) {}

  @ApiOperation({ summary: 'Список всех периодичностей задач' })
  @ApiOkResponse({
    description: 'Список периодичностей задач',
    type: Periodicity,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ required: false, type: PeriodicityFilter })
  @Post('all')
  findAll(@Body() periodicityFilter: PeriodicityFilter) {
    return this.periodicityService.findAll(periodicityFilter);
  }

  @ApiOperation({ summary: 'Список всех периодичностей задач' })
  @ApiOkResponse({
    description: 'Список периодичностей задач',
    type: Periodicity,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAll() {
    return this.periodicityService.findAll({});
  }
}
