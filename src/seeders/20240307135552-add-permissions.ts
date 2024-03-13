'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Permissions', [
      {
        permission_id: 47,
        permission_sku: 'branch-create',
        permission_name: 'Создание филиала',
        permission_description: 'Создание филиала',
        entity_name: 'branch',
      },
      {
        permission_id: 48,
        permission_sku: 'branch-update',
        permission_name: 'Изменение филиала',
        permission_description: 'Изменение филиала',
        entity_name: 'branch',
      },
      {
        permission_id: 49,
        permission_sku: 'branch-delete',
        permission_name: 'Удаление филиала',
        permission_description: 'Удаление филиала',
        entity_name: 'branch',
      },
      {
        permission_id: 50,
        permission_sku: 'checkpoint-type-create',
        permission_name: 'Создание типа пункта пропуска',
        permission_description: 'Создание типа пункта пропуска',
        entity_name: 'checkpoint-type',
      },
      {
        permission_id: 51,
        permission_sku: 'checkpoint-type-update',
        permission_name: 'Изменение типа пункта пропуска',
        permission_description: 'Изменение типа пункта пропуска',
        entity_name: 'checkpoint-type',
      },
      {
        permission_id: 52,
        permission_sku: 'checkpoint-type-delete',
        permission_name: 'Удаление типа пункта пропуска',
        permission_description: 'Удаление типа пункта пропуска',
        entity_name: 'checkpoint-type',
      },
      {
        permission_id: 53,
        permission_sku: 'facility-type-create',
        permission_name: 'Создание типа объекта обслуживания',
        permission_description: 'Создание типа объекта обслуживания',
        entity_name: 'facility-type',
      },
      {
        permission_id: 54,
        permission_sku: 'facility-type-update',
        permission_name: 'Изменение типа объекта обслуживания',
        permission_description: 'Изменение типа объекта обслуживания',
        entity_name: 'facility-type',
      },
      {
        permission_id: 55,
        permission_sku: 'facility-type-delete',
        permission_name: 'Удаление типа объекта обслуживания',
        permission_description: 'Удаление типа объекта обслуживания',
        entity_name: 'facility-type',
      },
      {
        permission_id: 56,
        permission_sku: 'neighboring-state-create',
        permission_name: 'Создание приграничного государства',
        permission_description: 'Создание приграничного государства',
        entity_name: 'neighboring-state',
      },
      {
        permission_id: 57,
        permission_sku: 'neighboring-state-update',
        permission_name: 'Изменение приграничного государства',
        permission_description: 'Изменение приграничного государства',
        entity_name: 'neighboring-state',
      },
      {
        permission_id: 58,
        permission_sku: 'neighboring-state-delete',
        permission_name: 'Удаление приграничного государства',
        permission_description: 'Удаление приграничного государства',
        entity_name: 'neighboring-state',
      },
      {
        permission_id: 59,
        permission_sku: 'operating-mode-create',
        permission_name: 'Создание режима работы',
        permission_description: 'Создание режима работы',
        entity_name: 'operating-mode',
      },
      {
        permission_id: 60,
        permission_sku: 'operating-mode-update',
        permission_name: 'Изменение режима работы',
        permission_description: 'Изменение режима работы',
        entity_name: 'operating-mode',
      },
      {
        permission_id: 61,
        permission_sku: 'operating-mode-delete',
        permission_name: 'Удаление режима работы',
        permission_description: 'Удаление режима работы',
        entity_name: 'operating-mode',
      },
      {
        permission_id: 62,
        permission_sku: 'order-update-status',
        permission_name: 'Изменение статуса заказа',
        permission_description: 'Изменение статуса заказа',
        entity_name: 'order',
      },
      {
        permission_id: 63,
        permission_sku: 'order-update-executor',
        permission_name: 'Изменение исполнителя заказа',
        permission_description: 'Изменение исполнителя заказа',
        entity_name: 'order',
      },
      {
        permission_id: 64,
        permission_sku: 'organization-type-create',
        permission_name: 'Создание типа организации (вида деятельности)',
        permission_description: 'Создание типа организации (вида деятельности)',
        entity_name: 'organization-type',
      },
      {
        permission_id: 65,
        permission_sku: 'organization-type-update',
        permission_name: 'Изменение типа организации (вида деятельности)',
        permission_description: 'Изменение типа организации (вида деятельности)',
        entity_name: 'organization-type',
      },
      {
        permission_id: 66,
        permission_sku: 'organization-type-delete',
        permission_name: 'Удаление типа организации (вида деятельности)',
        permission_description: 'Удаление типа организации (вида деятельности)',
        entity_name: 'organization-type',
      },
      {
        permission_id: 67,
        permission_sku: 'property-create',
        permission_name: 'Создание характеристики',
        permission_description: 'Создание характеристики',
        entity_name: 'property',
      },
      {
        permission_id: 68,
        permission_sku: 'property-update',
        permission_name: 'Изменение характеристики',
        permission_description: 'Изменение характеристики',
        entity_name: 'property',
      },
      {
        permission_id: 69,
        permission_sku: 'property-delete',
        permission_name: 'Удаление характеристики',
        permission_description: 'Удаление характеристики',
        entity_name: 'property',
      },
      {
        permission_id: 70,
        permission_sku: 'report-branch-create',
        permission_name: 'Создание отчета по филиалу',
        permission_description: 'Создание отчета по филиалу',
        entity_name: 'report',
      },
      {
        permission_id: 71,
        permission_sku: 'report-checkpoint-create',
        permission_name: 'Создание отчета по пунктам пропуска',
        permission_description: 'Создание отчета по пунктам пропуска',
        entity_name: 'report',
      },
      {
        permission_id: 72,
        permission_sku: 'report-organization-create',
        permission_name: 'Создание отчета по подрядчикам',
        permission_description: 'Создание отчета по подрядчикам',
        entity_name: 'report',
      },
      {
        permission_id: 73,
        permission_sku: 'working-hours-create',
        permission_name: 'Создание часов работы',
        permission_description: 'Создание часов работы',
        entity_name: 'working-hours',
      },
      {
        permission_id: 74,
        permission_sku: 'working-hours-update',
        permission_name: 'Изменение часов работы',
        permission_description: 'Изменение часов работы',
        entity_name: 'working-hours',
      },
      {
        permission_id: 75,
        permission_sku: 'working-hours-delete',
        permission_name: 'Удаление часов работы',
        permission_description: 'Удаление часов работы',
        entity_name: 'working-hours',
      },
      {
        permission_id: 76,
        permission_sku: 'branch-get',
        permission_name: 'Получение списка филиалов',
        permission_description: 'Получение списка филиалов',
        entity_name: 'branch',
      },
      {
        permission_id: 77,
        permission_sku: 'category-get',
        permission_name: 'Получение списка категорий',
        permission_description: 'Получение списка категорий',
        entity_name: 'category',
      },
      {
        permission_id: 78,
        permission_sku: 'checkpoint-get',
        permission_name: 'Получение списка пунктов пропуска',
        permission_description: 'Получение списка пунктов пропуска',
        entity_name: 'checkpoint',
      },
      {
        permission_id: 79,
        permission_sku: 'checkpoint-type-get',
        permission_name: 'Получение списка типов пунктов пропуска',
        permission_description: 'Получение списка типов пунктов пропуска',
        entity_name: 'checkpoint-type',
      },
      {
        permission_id: 80,
        permission_sku: 'facility-get',
        permission_name: 'Получение списка объектов обслуживания',
        permission_description: 'Получение списка объектов обслуживания',
        entity_name: 'facility',
      },
      {
        permission_id: 81,
        permission_sku: 'facility-type-get',
        permission_name: 'Получение списка типов объектов обслуживания',
        permission_description: 'Получение списка типов объектов обслуживания',
        entity_name: 'facility-type',
      },
      {
        permission_id: 82,
        permission_sku: 'file-type-get',
        permission_name: 'Получение списка типов файлов',
        permission_description: 'Получение списка типов файлов',
        entity_name: 'file-type',
      },
      {
        permission_id: 83,
        permission_sku: 'group-get',
        permission_name: 'Получение списка групп',
        permission_description: 'Получение списка групп',
        entity_name: 'group',
      },
      {
        permission_id: 84,
        permission_sku: 'neighboring-state-get',
        permission_name: 'Получение списка приграничных государств',
        permission_description: 'Получение списка приграничных государств',
        entity_name: 'neighboring-state',
      },
      {
        permission_id: 85,
        permission_sku: 'operating-mode-get',
        permission_name: 'Получение списка режимов работы',
        permission_description: 'Получение списка режимов работы',
        entity_name: 'operating-mode',
      },
      {
        permission_id: 86,
        permission_sku: 'order-get',
        permission_name: 'Получение списка заказов',
        permission_description: 'Получение списка заказов',
        entity_name: 'order',
      },
      {
        permission_id: 87,
        permission_sku: 'order-status-get',
        permission_name: 'Получение списка статусов заказов',
        permission_description: 'Получение списка статусов заказов',
        entity_name: 'order-status',
      },
      {
        permission_id: 88,
        permission_sku: 'organization-get',
        permission_name: 'Получение списка организаций',
        permission_description: 'Получение списка организаций',
        entity_name: 'organization',
      },
      {
        permission_id: 89,
        permission_sku: 'organization-type-get',
        permission_name: 'Получение списка типов организаций',
        permission_description: 'Получение списка типов организаций',
        entity_name: 'organization-type',
      },
      {
        permission_id: 90,
        permission_sku: 'permission-get',
        permission_name: 'Получение списка прав',
        permission_description: 'Получение списка прав',
        entity_name: 'permission',
      },
      {
        permission_id: 91,
        permission_sku: 'priority-get',
        permission_name: 'Получение списка приоритетов',
        permission_description: 'Получение списка приоритетов',
        entity_name: 'priority',
      },
      {
        permission_id: 92,
        permission_sku: 'property-get',
        permission_name: 'Получение списка характеристик',
        permission_description: 'Получение списка характеристик',
        entity_name: 'property',
      },
      {
        permission_id: 93,
        permission_sku: 'report-get',
        permission_name: 'Получение списка отчетов',
        permission_description: 'Получение списка отчетов',
        entity_name: 'report',
      },
      {
        permission_id: 94,
        permission_sku: 'role-get',
        permission_name: 'Получение списка ролей',
        permission_description: 'Получение списка ролей',
        entity_name: 'role',
      },
      {
        permission_id: 95,
        permission_sku: 'role-permission-get',
        permission_name: 'Получение списка разрешений',
        permission_description: 'Получение списка разрешений',
        entity_name: 'role-permission',
      },
      {
        permission_id: 96,
        permission_sku: 'task-get',
        permission_name: 'Получение списка задач',
        permission_description: 'Получение списка задач',
        entity_name: 'task',
      },
      {
        permission_id: 97,
        permission_sku: 'user-get',
        permission_name: 'Получение списка пользователей',
        permission_description: 'Получение списка пользователей',
        entity_name: 'user',
      },
      {
        permission_id: 98,
        permission_sku: 'person-status-get',
        permission_name: 'Получение списка статусов пользователей',
        permission_description: 'Получение списка статусов ыпользователей',
        entity_name: 'person-status',
      },
      {
        permission_id: 99,
        permission_sku: 'working-hours-get',
        permission_name: 'Получение списка часов работы',
        permission_description: 'Получение списка часов работы',
        entity_name: 'working-hours',
      },
      {
        permission_id: 100,
        permission_sku: 'report-branches-create',
        permission_name: 'Создание отчета по филиалам',
        permission_description: 'Создание отчета по филиалам',
        entity_name: 'report',
      },
    ])
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Permissions', null, {})
  },
}