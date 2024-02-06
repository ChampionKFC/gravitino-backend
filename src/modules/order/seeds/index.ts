import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Order } from '../entities/order.entity';

@Seeder({
  model: Order,
  unique: ['task_id'],
  containsForeignKeys: true,
  foreignDelay: 20000,
})
export class OrderSeeds implements OnSeederInit {
  run() {
    const data = [
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 1,
        executor_id: 1,
        completed_by: 1,
        creator_id: 1,
        order_status_id: 2,
        planned_datetime: new Date('2024-01-24'),
        task_end_datetime: new Date('2024-01-25'),
        priority_id: 1,
      },
      {
        task_id: 2,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 2,
        executor_id: 2,
        completed_by: 2,
        creator_id: 2,
        order_status_id: 4,
        planned_datetime: new Date('2024-01-24'),
        task_end_datetime: new Date('2024-01-25'),
        priority_id: 1,
      },
      {
        task_id: 3,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 3,
        executor_id: 3,
        completed_by: 3,
        creator_id: 3,
        order_status_id: 5,
        planned_datetime: new Date('2024-01-23'),
        task_end_datetime: new Date('2024-01-24'),
        priority_id: 1,
      },
      {
        task_id: 4,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 4,
        executor_id: 4,
        completed_by: 4,
        creator_id: 4,
        order_status_id: 6,
        planned_datetime: new Date('2024-01-25'),
        task_end_datetime: new Date('2024-01-26'),
        priority_id: 1,
      },
      {
        task_id: 5,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-21'),
        task_end_datetime: new Date('2024-01-22'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-22'),
        task_end_datetime: new Date('2024-01-23'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-23'),
        task_end_datetime: new Date('2024-01-24'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-24'),
        task_end_datetime: new Date('2024-01-25'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-25'),
        task_end_datetime: new Date('2024-01-26'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-26'),
        task_end_datetime: new Date('2024-01-27'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-27'),
        task_end_datetime: new Date('2024-01-28'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-28'),
        task_end_datetime: new Date('2024-01-29'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-29'),
        task_end_datetime: new Date('2024-01-30'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-01-30'),
        task_end_datetime: new Date('2024-01-31'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-01'),
        task_end_datetime: new Date('2024-02-02'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-02'),
        task_end_datetime: new Date('2024-02-03'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-03'),
        task_end_datetime: new Date('2024-02-04'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-04'),
        task_end_datetime: new Date('2024-02-05'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-06'),
        task_end_datetime: new Date('2024-02-07'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-08'),
        task_end_datetime: new Date('2024-02-09'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-09'),
        task_end_datetime: new Date('2024-02-10'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-10'),
        task_end_datetime: new Date('2024-02-11'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-12'),
        task_end_datetime: new Date('2024-02-13'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-13'),
        task_end_datetime: new Date('2024-02-14'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-14'),
        task_end_datetime: new Date('2024-02-15'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-15'),
        task_end_datetime: new Date('2024-02-16'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-16'),
        task_end_datetime: new Date('2024-02-17'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-17'),
        task_end_datetime: new Date('2024-02-18'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-18'),
        task_end_datetime: new Date('2024-02-19'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-20'),
        task_end_datetime: new Date('2024-02-21'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-21'),
        task_end_datetime: new Date('2024-02-22'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-22'),
        task_end_datetime: new Date('2024-02-23'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-23'),
        task_end_datetime: new Date('2024-02-24'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-24'),
        task_end_datetime: new Date('2024-02-25'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-25'),
        task_end_datetime: new Date('2024-02-26'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-26'),
        task_end_datetime: new Date('2024-02-27'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-27'),
        task_end_datetime: new Date('2024-02-28'),
        priority_id: 1,
      },
      {
        task_id: 1,
        order_name: 'Уборка снега',
        order_description: 'Уборка снега возле входа в котельную',
        facility_id: 1,
        organization_id: 5,
        executor_id: 5,
        completed_by: 5,
        creator_id: 5,
        order_status_id: 1,
        planned_datetime: new Date('2024-02-28'),
        task_end_datetime: new Date('2024-02-29'),
        priority_id: 1,
      },
    ];
    return data;
  }
}
