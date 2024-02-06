import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { OrderStatus } from '../entities/order_status.entity';

@Seeder({
  model: OrderStatus,
  unique: ['order_status_name'],
})
export class OrderStatusSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        order_status_id: 1,
        order_status_name: 'Создана',
      },
      {
        order_status_id: 2,
        order_status_name: 'Назначена',
      },
      {
        order_status_id: 3,
        order_status_name: 'В работе',
      },
      {
        order_status_id: 4,
        order_status_name: 'На проверке',
      },
      {
        order_status_id: 5,
        order_status_name: 'Закрыта',
      },
      {
        order_status_id: 6,
        order_status_name: 'Отменена',
      },
      {
        order_status_id: 7,
        order_status_name: 'Закрыта с нарушением дедлайна',
      },
      {
        order_status_id: 8,
        order_status_name: 'Необходима доработка',
      },
    ];
    return data;
  }
}
