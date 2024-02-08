import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common'
import { PersonService } from './person.service'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/exception.filter'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { PersonFilter } from './filters'
import { AppStrings } from 'src/common/constants/strings'
import { ArrayPersonResponse } from './response'

@ApiBearerAuth()
@ApiTags('Person')
@Controller('person')
@UseFilters(AllExceptionsFilter)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: AppStrings.PERSON_ALL_OPERATION })
  @ApiOkResponse({
    description: AppStrings.PERSON_ALL_RESPONSE,
    type: ArrayPersonResponse,
  })
  @ApiBody({ required: false, type: PersonFilter })
  @Post('all')
  findAll(@Body() personFilter: PersonFilter) {
    return this.personService.findAll(personFilter)
  }
}
