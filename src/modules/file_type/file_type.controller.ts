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
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { FileTypeService } from './file_type.service';
import { CreateFileTypeDto, UpdateFileTypeDto } from './dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AppError } from 'src/common/constants/error';
import { AllExceptionsFilter } from 'src/common/exception.filter';
import { FileType } from './entities/file_type.entity';
import { StatusFileTypeResponse } from './response';

@ApiBearerAuth()
@ApiTags('File type')
@Controller('file-type')
@UseFilters(AllExceptionsFilter)
export class FileTypeController {
  constructor(private readonly fileTypeService: FileTypeService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание типа файла' })
  @ApiCreatedResponse({
    description: 'Тип файла успешно создан',
    type: StatusFileTypeResponse,
  })
  @Post()
  async create(@Body() createFileTypeDto: CreateFileTypeDto, @Req() request) {
    return this.fileTypeService.create(createFileTypeDto, request.user.user_id);
  }

  @ApiOperation({ summary: 'Список всех типов файлов' })
  @ApiOkResponse({
    description: 'Список типов файлов',
    type: FileType,
    isArray: true,
  })
  @Get('all')
  async findAll() {
    return this.fileTypeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Изменение отдельного типа файла' })
  @ApiOkResponse({
    description: 'Тип файла успешно изменен',
    type: FileType,
  })
  @ApiResponse({ status: 404, description: 'Тип файла не существует!' })
  @Patch()
  async update(@Body() updateFileTypeDto: UpdateFileTypeDto, @Req() request) {
    let foundFileType = null;
    if (updateFileTypeDto.file_type_id) {
      foundFileType = await this.fileTypeService.findOne(
        updateFileTypeDto.file_type_id,
      );
    }
    if (!foundFileType) {
      throw new HttpException(
        AppError.FILE_TYPE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.fileTypeService.update(updateFileTypeDto, request.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удаление типа файла' })
  @ApiOkResponse({
    description: 'Тип файла успешно удален',
    type: StatusFileTypeResponse,
  })
  @ApiResponse({ status: 404, description: 'Тип файла не существует!' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const foundFileType = await this.fileTypeService.findOne(id);
    if (!foundFileType) {
      throw new HttpException(
        AppError.FILE_TYPE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.fileTypeService.remove(+id, request.user.user_id);
  }
}
