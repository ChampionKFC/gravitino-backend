import { Injectable } from '@nestjs/common'
import { AppStrings } from 'src/common/constants/strings'

@Injectable()
export class AppService {
  getHello(): string {
    return AppStrings.PROJECT_NAME
  }
}
