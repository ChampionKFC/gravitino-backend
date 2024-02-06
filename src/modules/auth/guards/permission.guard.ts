import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from './enums/permission.enum';
import { RolesPermissionsService } from 'src/modules/roles_permissions/roles_permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >('permissions', [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    const result = await asyncSome(requiredPermissions, async (permission) => {
      // console.log(`PERMISSION: ${permission}`);
      // console.log(`RESULT: ${await this.rolesPermissionsService.checkPermission(permission, user.user_id)}`);
      return await this.rolesPermissionsService.checkPermission(
        permission,
        user.user_id,
      );
    });
    // console.log(`FINAL: ${result}`);

    return result;
  }
}

const asyncSome = async (array, predicate) => {
  for (const element of array) {
    if (await predicate(element)) return true;
  }
  return false;
};
