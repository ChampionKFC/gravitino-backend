import { Injectable } from '@nestjs/common'
import { CreateFileTypeDto, UpdateFileTypeDto } from './dto'
import { FileType } from './entities/file_type.entity'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionHistoryService } from '../transaction_history/transaction_history.service'
import { FileTypeResponse, StatusFileTypeResponse } from './response'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class FileTypeService {
  constructor(
    @InjectModel(FileType) private fileTypeRepository: typeof FileType,
    private readonly historyService: TransactionHistoryService,
  ) {}

  async create(fileType: CreateFileTypeDto, user_id: number): Promise<StatusFileTypeResponse> {
    try {
      const newFileType = await this.fileTypeRepository.create({ ...fileType })

      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_FILE_TYPE_CREATED}${newFileType.file_type_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true, data: newFileType }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(): Promise<ArrayFileTypeResponse> {
    try {
      const result = await this.fileTypeRepository.findAll()
      return { count: result.length, data: result }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(file_type_id: number): Promise<boolean> {
    try {
      const foundFileType = await this.fileTypeRepository.findOne({
        where: { file_type_id },
      })
      if (foundFileType) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(updatedFile: UpdateFileTypeDto, user_id: number): Promise<FileTypeResponse> {
    try {
      let foundFileType = null
      await this.fileTypeRepository.update({ ...updatedFile }, { where: { file_type_id: updatedFile.file_type_id } })

      foundFileType = await this.fileTypeRepository.findOne({
        where: { file_type_id: updatedFile.file_type_id },
      })

      if (foundFileType) {
        const historyDto = {
          user_id: user_id,
          comment: `${AppStrings.HISTORY_FILE_TYPE_UPDATED}${foundFileType.file_type_id}`,
        }
        await this.historyService.create(historyDto)
      }

      return foundFileType
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(file_type_id: number, user_id: number): Promise<StatusFileTypeResponse> {
    const deleteFileType = await this.fileTypeRepository.destroy({
      where: { file_type_id },
    })

    if (deleteFileType) {
      const historyDto = {
        user_id: user_id,
        comment: `${AppStrings.HISTORY_FILE_TYPE_DELETED}${file_type_id}`,
      }
      await this.historyService.create(historyDto)

      return { status: true }
    }

    return { status: false }
  }
}
