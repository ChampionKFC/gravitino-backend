import { Controller, Post, UseGuards, UseInterceptors, Query, Req, UploadedFiles } from '@nestjs/common'
import { FilesService } from './files.service'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { OrderService } from '../order/order.service'
import { FileTypeService } from '../file_type/file_type.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { StatusFileResponse } from './response'
import { UploadFileDto } from './dto'
import { AppStrings } from 'src/common/constants/strings'

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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const destination = `./uploads/${req.query.directory}`
          cb(null, `${destination}`)
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
      limits: { fileSize: 5242880 },
      fileFilter: (req, file, callback) => {
        if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) callback(null, false)
        callback(null, true)
      },
    }),
  )
  @Post('upload-images')
  async upload(
    @Query() query: UploadFileDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Req() request,
  ) {
    const urls = []

    for (let index = 0; index < files.length; index++) {
      const file = files[index]

      const url = `${request.protocol}://${request.get('Host')}/file/uploads?path=${file.path}`
      urls.push(url)
    }

    return urls
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
