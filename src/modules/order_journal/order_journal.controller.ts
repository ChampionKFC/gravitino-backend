import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common'
import { OrderJournalService } from './order_journal.service'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayOrderJournalResponse } from './response'
import { ActiveGuard } from '../auth/guards/active.guard'
import { OrderJournalFilter } from './filters'

@ApiTags('Order Journal')
@Controller('order-journal')
@ApiBearerAuth()
@UseFilters(AllExceptionsFilter)
export class OrderJournalController {
  constructor(private readonly orderJournalService: OrderJournalService) {}

  @ApiOkResponse({
    description: AppStrings.ORDER_JOURNAL_ALL_RESPONSE,
    type: ArrayOrderJournalResponse,
  })
  @ApiOperation({ summary: AppStrings.ORDER_JOURNAL_ALL_OPERATION })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @Post()
  findByTask(@Body() orderJournalFilter: OrderJournalFilter) {
    return this.orderJournalService.findAll(orderJournalFilter)
  }
}
