import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GroupFilters, GroupSorts } from 'src/modules/group/dto';
import {
  OrganizationFilters,
  OrganizationSorts,
} from 'src/modules/organization/dto';
import { PersonFilters, PersonSorts } from 'src/modules/person/dto';
import { RoleFilters, RoleSorts } from 'src/modules/roles/dto';

export class CreateUserDto {
  @ApiProperty({ required: false })
  last_name?: string;

  @ApiProperty({ required: false })
  first_name?: string;

  @ApiProperty({ required: false })
  patronymic?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @IsOptional()
  person_id?: number;

  @ApiProperty({ default: 1 })
  role_id: number;

  @ApiProperty({ default: 1, required: false })
  organization_id?: number;

  @ApiProperty({ default: 1, required: false })
  group_id?: number;

  @ApiProperty({ default: true, required: false })
  is_active?: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ default: [], required: false })
  property_values?: number[];
}

export class UpdateUserDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty({ required: false })
  last_name?: string;

  @ApiProperty({ required: false })
  first_name?: string;

  @ApiProperty({ required: false })
  patronymic?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @IsOptional()
  person_id?: number;

  @ApiProperty({ default: 1, required: false })
  role_id?: number;

  @ApiProperty({ default: 1, required: false })
  organization_id?: number;

  @ApiProperty({ default: 1, required: false })
  group_id?: number;

  @ApiProperty({ default: true, required: false })
  is_active?: boolean;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ default: [], required: false })
  property_values?: number[];
}

export class UserSorts {
  @ApiProperty({ default: 'ASC', required: false })
  user_id?: string;

  @ApiProperty({ default: 'ASC', required: false })
  email?: string;

  @ApiProperty({ default: 'ASC', required: false })
  is_active?: string;

  @ApiProperty({ required: false })
  person?: PersonSorts;

  @ApiProperty({ required: false })
  role?: RoleSorts;

  @ApiProperty({ required: false })
  group?: GroupSorts;

  // @ApiProperty()
  // facility?: FacilitySorts;

  // @ApiProperty()
  // checkpoint?: CheckpointSorts;

  @ApiProperty({ required: false })
  organization?: OrganizationSorts;
}

export class UserFilters {
  @ApiProperty({ required: false })
  user_id?: number;

  @ApiProperty({ required: false })
  person?: PersonFilters;

  @ApiProperty({ required: false })
  role?: RoleFilters;

  @ApiProperty({ required: false })
  organization?: OrganizationFilters;

  @ApiProperty({ required: false })
  group?: GroupFilters;

  @ApiProperty({ default: true, required: false })
  is_active?: boolean;

  @ApiProperty({ required: false })
  email?: string;
}
