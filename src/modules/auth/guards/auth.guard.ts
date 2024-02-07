import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JsonWebTokenError } from 'jsonwebtoken'
import { AppError } from 'src/common/constants/error'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(AppError.INVALID_JWT)
    }

    return super.handleRequest(err, user, info, context, status)
  }
}
