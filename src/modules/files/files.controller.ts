import { Controller, Post, UseGuards, UseInterceptors, Query, Req, UploadedFiles, Get, HttpException, HttpStatus } from '@nestjs/common'
import { FilesService } from './files.service'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { OrderService } from '../order/order.service'
import { FileTypeService } from '../file_type/file_type.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { StatusFileResponse } from './response'
import { UploadFileDto } from './dto'
import { AppStrings } from 'src/common/constants/strings'
import { ActiveGuard } from '../auth/guards/active.guard'
import { AppError } from 'src/common/constants/error'

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly orderService: OrderService,
    private readonly fileTypeService: FileTypeService,
  ) {}

  @ApiCreatedResponse({
    description: AppStrings.FILE_CREATED_RESPONSE,
    type: StatusFileResponse,
  })
  @ApiOperation({ summary: AppStrings.FILE_CREATE_OPERATION })
  @UseGuards(JwtAuthGuard, ActiveGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5242880 },
      fileFilter: (req, file, callback) => {
        if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) callback(null, false)
        callback(null, true)
      },
    }),
  )
  @Post('upload-images')
  async upload(
    @Query() uploadFileDto: UploadFileDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Req() request,
  ) {
    if (uploadFileDto.order_ids.length > 0) {
      for (const order_id of uploadFileDto.order_ids) {
        const foundOrder = await this.orderService.findOne(order_id)
        if (!foundOrder) {
          throw new HttpException(`${AppError.ORDER_NOT_FOUND} (ID: ${order_id})`, HttpStatus.NOT_FOUND)
        }
      }
    } else {
      throw new HttpException(AppError.ORDERS_NOT_SELECTED, HttpStatus.BAD_REQUEST)
    }

    return this.filesService.uploadToS3(uploadFileDto, files, request.user.user_id)
  }

  @Get('find')
  async findImage(@Query('file_ids') file_ids: number[]) {
    return this.filesService.loadFromS3(file_ids)
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Создание файла' })
  // @ApiCreatedResponse({
  //   description: 'Файл успешно создан',
  //   type: StatusFileResponse,
  // })
  // @Post()
  // async create(@Body() createFileDto: CreateFileDto, @Req() request) {
  //   const foundOrder = await this.orderService.findOne(createFileDto.order_id);
  //   if (!foundOrder) {
  //     throw new HttpException(AppError.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }

  //   const foundFileType = await this.fileTypeService.findOne(
  //     createFileDto.file_type_id,
  //   );
  //   if (!foundFileType) {
  //     throw new HttpException(
  //       AppError.FILE_TYPE_NOT_FOUND,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   return this.filesService.create(createFileDto, request.user.user_id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Список всех файлов' })
  // @ApiOkResponse({
  //   description: 'Список всех файлов',
  //   type: File,
  //   isArray: true,
  // })
  // @Get('all')
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Изменение файла' })
  // @ApiOkResponse({
  //   description: 'Файл успешно изменен',
  //   type: File,
  // })
  // @Patch()
  // async update(@Body() updateFileDto: UpdateFileDto, @Req() request) {
  //   let foundFile = null;
  //   if (updateFileDto.file_id) {
  //     foundFile = await this.filesService.findOne(updateFileDto.file_id);
  //   }
  //   if (!foundFile) {
  //     throw new HttpException(AppError.FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }

  //   if (updateFileDto.order_id) {
  //     const foundOrder = await this.orderService.findOne(
  //       updateFileDto.order_id,
  //     );
  //     if (!foundOrder) {
  //       throw new HttpException(AppError.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
  //     }
  //   }

  //   if (updateFileDto.file_type_id) {
  //     const foundFileType = await this.fileTypeService.findOne(
  //       updateFileDto.file_type_id,
  //     );
  //     if (!foundFileType) {
  //       throw new HttpException(
  //         AppError.FILE_TYPE_NOT_FOUND,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //   }

  //   return this.filesService.update(updateFileDto, request.user.user_id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Удаление файла' })
  // @ApiOkResponse({
  //   description: 'Файл успешно удален',
  //   type: StatusFileResponse,
  // })
  // @Delete(':id')
  // async remove(@Param('id') id: number, @Req() request) {
  //   const foundFile = await this.filesService.findOne(id);
  //   if (!foundFile) {
  //     throw new HttpException(AppError.FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }

  //   return this.filesService.remove(+id, request.user.user_id);
  // }
}
