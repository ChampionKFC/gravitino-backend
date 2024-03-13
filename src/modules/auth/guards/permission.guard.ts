import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PermissionEnum } from './enums/permission.enum'
import { RolesPermissionsService } from 'src/modules/roles_permissions/roles_permissions.service'
import { AppError } from 'src/common/constants/error'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionEnum[]>('permissions', [context.getHandler(), context.getClass()])

    if (!requiredPermissions) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    const result = await asyncSome(requiredPermissions, async (permission) => {
      return await this.rolesPermissionsService.checkPermission(permission, user.user_id)
    })

    if (result) {
      return result
    } else {
      throw new ForbiddenException(AppError.FORBIDDEN_RESOURCE)
    }
  }
}

const asyncSome = async (array, predicate) => {
  for (const element of array) {
    if (await predicate(element)) return true
  }
  return false
}
