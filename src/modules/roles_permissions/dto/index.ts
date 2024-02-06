import { ApiProperty } from '@nestjs/swagger';

export class CreateRolesPermissionDto {
  @ApiProperty()
  role_id: number;

  @ApiProperty()
  permission_id: number;

  @ApiProperty()
  rights: boolean;
}

export class UpdateRolesPermissionDto {
  @ApiProperty({ required: false })
  role_permission_id?: number;

  @ApiProperty({ required: false })
  role_id?: number;

  @ApiProperty({ required: false })
  permission_id?: number;

  @ApiProperty({ required: false })
  rights?: boolean;
}
