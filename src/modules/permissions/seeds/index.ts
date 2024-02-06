import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Permission } from '../entities/permission.entity';

@Seeder({
  model: Permission,
  unique: ['permission_sku'],
})
export class PermissionSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        permission_sku: 'category-create',
        permission_name: 'Создание категорий',
        permission_description: 'Создание категорий',
        entity_name: 'category',
      },
      {
        permission_sku: 'category-update',
        permission_name: 'Изменение категорий',
        permission_description: 'Изменение категорий',
        entity_name: 'category',
      },
      {
        permission_sku: 'category-delete',
        permission_name: 'Удаление категорий',
        permission_description: 'Удаление категорий',
        entity_name: 'category',
      },
      {
        permission_sku: 'checkpoint-create',
        permission_name: 'Создание пунтков пропуска',
        permission_description: 'Создание пунтков пропуска',
        entity_name: 'checkpoint',
      },
      {
        permission_sku: 'checkpoint-update',
        permission_name: 'Изменение пунтков пропуска',
        permission_description: 'Изменение пунтков пропуска',
        entity_name: 'checkpoint',
      },
      {
        permission_sku: 'checkpoint-delete',
        permission_name: 'Удаление пунтков пропуска',
        permission_description: 'Удаление пунтков пропуска',
        entity_name: 'checkpoint',
      },
      {
        permission_sku: 'facility-create',
        permission_name: 'Создание объекта обслуживания',
        permission_description: 'Создание объекта обслуживания',
        entity_name: 'facility',
      },
      {
        permission_sku: 'facility-update',
        permission_name: 'Изменение объекта обслуживания',
        permission_description: 'Изменение объекта обслуживания',
        entity_name: 'facility',
      },
      {
        permission_sku: 'facility-delete',
        permission_name: 'Удаление объекта обслуживания',
        permission_description: 'Удаление объекта обслуживания',
        entity_name: 'facility',
      },
      {
        permission_sku: 'file-type-create',
        permission_name: 'Создание типа файла',
        permission_description: 'Создание типа файла',
        entity_name: 'file-type',
      },
      {
        permission_sku: 'file-type-update',
        permission_name: 'Изменение типа файла',
        permission_description: 'Изменение типа файла',
        entity_name: 'file-type',
      },
      {
        permission_sku: 'file-type-delete',
        permission_name: 'Удаление типа файла',
        permission_description: 'Удаление типа файла',
        entity_name: 'file-type',
      },
      {
        permission_sku: 'group-create',
        permission_name: 'Создание группы',
        permission_description: 'Создание группы',
        entity_name: 'group',
      },
      {
        permission_sku: 'group-update',
        permission_name: 'Изменение группы',
        permission_description: 'Изменение группы',
        entity_name: 'group',
      },
      {
        permission_sku: 'group-delete',
        permission_name: 'Удаление группы',
        permission_description: 'Удаление группы',
        entity_name: 'group',
      },
      {
        permission_sku: 'order-create',
        permission_name: 'Создание заказа',
        permission_description: 'Создание заказа',
        entity_name: 'order',
      },
      {
        permission_sku: 'order-update',
        permission_name: 'Изменение заказа',
        permission_description: 'Изменение заказа',
        entity_name: 'order',
      },
      {
        permission_sku: 'order-delete',
        permission_name: 'Удаление заказа',
        permission_description: 'Удаление заказа',
        entity_name: 'order',
      },
      {
        permission_sku: 'order-status-create',
        permission_name: 'Создание статуса заказа',
        permission_description: 'Создание статуса заказа',
        entity_name: 'order-status',
      },
      {
        permission_sku: 'order-status-update',
        permission_name: 'Изменение статуса заказа',
        permission_description: 'Изменение статуса заказа',
        entity_name: 'order-status',
      },
      {
        permission_sku: 'order-status-delete',
        permission_name: 'Удаление статуса заказа',
        permission_description: 'Удаление статуса заказа',
        entity_name: 'order-status',
      },
      {
        permission_sku: 'organization-create',
        permission_name: 'Создание организации',
        permission_description: 'Создание организации',
        entity_name: 'organization',
      },
      {
        permission_sku: 'organization-update',
        permission_name: 'Изменение организации',
        permission_description: 'Изменение организации',
        entity_name: 'organization',
      },
      {
        permission_sku: 'organization-delete',
        permission_name: 'Удаление организации',
        permission_description: 'Удаление организации',
        entity_name: 'organization',
      },
      {
        permission_sku: 'permission-create',
        permission_name: 'Создание разрешения',
        permission_description: 'Создание разрешения',
        entity_name: 'permission',
      },
      {
        permission_sku: 'permission-update',
        permission_name: 'Изменение разрешения',
        permission_description: 'Изменение разрешения',
        entity_name: 'permission',
      },
      {
        permission_sku: 'permission-delete',
        permission_name: 'Удаление разрешения',
        permission_description: 'Удаление разрешения',
        entity_name: 'permission',
      },
      {
        permission_sku: 'priority-create',
        permission_name: 'Создание приоритета',
        permission_description: 'Создание приоритета',
        entity_name: 'priority',
      },
      {
        permission_sku: 'priority-update',
        permission_name: 'Изменение приоритета',
        permission_description: 'Изменение приоритета',
        entity_name: 'priority',
      },
      {
        permission_sku: 'priority-delete',
        permission_name: 'Удаление приоритета',
        permission_description: 'Удаление приоритета',
        entity_name: 'priority',
      },
      {
        permission_sku: 'report-create',
        permission_name: 'Создание отчёта',
        permission_description: 'Создание отчёта',
        entity_name: 'report',
      },
      {
        permission_sku: 'report-update',
        permission_name: 'Изменение отчёта',
        permission_description: 'Изменение отчёта',
        entity_name: 'report',
      },
      {
        permission_sku: 'report-delete',
        permission_name: 'Удаление отчёта',
        permission_description: 'Удаление отчёта',
        entity_name: 'report',
      },
      {
        permission_sku: 'role-create',
        permission_name: 'Создание роли',
        permission_description: 'Создание роли',
        entity_name: 'role',
      },
      {
        permission_sku: 'role-update',
        permission_name: 'Изменение роли',
        permission_description: 'Изменение роли',
        entity_name: 'role',
      },
      {
        permission_sku: 'role-delete',
        permission_name: 'Удаление роли',
        permission_description: 'Удаление роли',
        entity_name: 'role',
      },
      {
        permission_sku: 'role-permission-create',
        permission_name: 'Создание роль-разрешение',
        permission_description: 'Создание роль-разрешение',
        entity_name: 'role-permission',
      },
      {
        permission_sku: 'role-permission-update',
        permission_name: 'Изменение роль-разрешение',
        permission_description: 'Изменение роль-разрешение',
        entity_name: 'role-permission',
      },
      {
        permission_sku: 'role-permission-delete',
        permission_name: 'Удаление роль-разрешение',
        permission_description: 'Удаление роль-разрешение',
        entity_name: 'role-permission',
      },
      {
        permission_sku: 'task-create',
        permission_name: 'Создание задачи',
        permission_description: 'Создание задачи',
        entity_name: 'task',
      },
      {
        permission_sku: 'task-update',
        permission_name: 'Изменение задачи',
        permission_description: 'Изменение задачи',
        entity_name: 'task',
      },
      {
        permission_sku: 'task-delete',
        permission_name: 'Удаление задачи',
        permission_description: 'Удаление задачи',
        entity_name: 'task',
      },
      {
        permission_sku: 'user-create',
        permission_name: 'Создание пользователя',
        permission_description: 'Создание пользователя',
        entity_name: 'user',
      },
      {
        permission_sku: 'user-update',
        permission_name: 'Изменение пользователя',
        permission_description: 'Изменение пользователя',
        entity_name: 'user',
      },
      {
        permission_sku: 'user-delete',
        permission_name: 'Удаление пользователя',
        permission_description: 'Удаление пользователя',
        entity_name: 'user',
      },
      {
        permission_sku: 'user-approve',
        permission_name: 'Подтверждение пользователя',
        permission_description: 'Подтверждение пользователя',
        entity_name: 'user',
      },
    ];
    return data;
  }
}
