import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { AppError } from 'src/common/constants/error'
import { UsersService } from 'src/modules/users/users.service'

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      throw new UnauthorizedException(AppError.USER_DEACTIVATED)
    }

    const canActivate = await this.userService.canUserActivate(user.user_id)

    if (canActivate) {
      return canActivate
    } else {
      throw new ForbiddenException(AppError.USER_DEACTIVATED)
    }
  }
}
