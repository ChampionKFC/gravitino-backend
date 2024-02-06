import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AllExceptionsFilter } from 'src/common/exception.filter';

@ApiBearerAuth()
@ApiTags('report')
@Controller('report')
@UseFilters(AllExceptionsFilter)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReportDto: CreateReportDto, @Req() request) {
    return this.reportService.create(createReportDto, request.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.reportService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() updateReportDto: UpdateReportDto, @Req() request) {
    return this.reportService.update(updateReportDto, request.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    return this.reportService.remove(+id, request.user.user_id);
  }
}
