import { Injectable } from '@nestjs/common'
import { CreateFileDto, UpdateFileDto, UploadFileDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { File } from './entities/file.entity'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { ArrayFileResponse, FileResponse, StatusFileResponse } from './response'
import { FileType } from '../file_type/entities/file_type.entity'
import { Order } from '../order/entities/order.entity'
import { AppStrings } from 'src/common/constants/strings'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { S3ENDPOINT, s3Client } from 'src/common/s3Client'
import { extname } from 'path'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File) private fileRepository: typeof File,
    private readonly historyService: TransactionHistoryService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createFileDto: CreateFileDto, user_id: number, transaction?: Transaction): Promise<StatusFileResponse> {
    const newFile = await this.fileRepository.create({ ...createFileDto }, { transaction })

    const historyDto = {
      user_id: user_id,
      comment: `${AppStrings.HISTORY_FILE_CREATED}${newFile.file_id}`,
    }
    await this.historyService.create(historyDto, transaction)

    return { status: true, data: newFile }
  }

  async findAll(): Promise<ArrayFileResponse> {
    try {
      const result = await this.fileRepository.findAll({
        include: [FileType, Order],
        attributes: { exclude: ['file_type_id', 'order_id'] },
      })
      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(file_id: number): Promise<boolean> {
    try {
      const foundFile = await this.fileRepository.findOne({
        where: { file_id },
      })

      if (foundFile) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updateFileDto: UpdateFileDto, user_id: number): Promise<FileResponse> {
    try {
      let foundFile = null
      await this.fileRepository.update({ ...updateFileDto }, { where: { file_id: updateFileDto.file_id } })

      foundFile = await this.fileRepository.findOne({
        where: { file_id: updateFileDto.file_id },
      })

      if (foundFile) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FILE_UPDATED}${foundFile.file_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundFile
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(file_id: number, user_id: number): Promise<StatusFileResponse> {
    const deleteFile = await this.fileRepository.destroy({
      where: { file_id },
    })

    if (deleteFile) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_FILE_DELETED}${file_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }

  async uploadToS3(uploadFilesDto: UploadFileDto, files: Array<Express.Multer.File>, user_id: number) {
    const transaction = await this.sequelize.transaction()
    try {
      const bucketName = 's3media'

      const links = []
      for (let index = 0; index < files.length; index++) {
        const file = files[index]

        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')

        const fileKey = `${uploadFilesDto.directory}/${uploadFilesDto.order_ids[0]}/${randomName}${extname(file.originalname)}`

        const params = {
          Bucket: bucketName,
          Key: fileKey,
          Body: file.buffer,
        }

        await s3Client.send(new PutObjectCommand(params))

        for (const order_id of uploadFilesDto.order_ids) {
          const createFileDto = new CreateFileDto()
          createFileDto.file_sku = fileKey
          createFileDto.file_alt = randomName
          createFileDto.order_id = order_id
          createFileDto.file_type_id = 2 // IMAGE TODO

          await this.create(createFileDto, user_id, transaction)
        }

        links.push(`${S3ENDPOINT}/${bucketName}/${fileKey}`)
      }

      transaction.commit()
      return { status: true, data: links }
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }

  async loadFromS3(file_ids: number[]) {
    const transaction = await this.sequelize.transaction()
    try {
      const bucketName = 's3media'

      const foundFiles = await this.fileRepository.findAll({
        where: { file_id: file_ids },
      })

      const links = []
      foundFiles.forEach((file) => {
        const fileKey = file.file_sku
        links.push(`${S3ENDPOINT}/${bucketName}/${fileKey}`)
      })

      transaction.commit()
      return links
    } catch (error) {
      transaction.rollback()
      throw new Error(error)
    }
  }
}
