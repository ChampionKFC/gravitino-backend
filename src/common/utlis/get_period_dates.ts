import moment = require('moment');
import { TaskStartEndDatetime } from 'src/modules/task/dto';

export default function getPeriodDates(
  periodicity_id: number,
  task_period_start: Date,
  task_period_end: Date,
): TaskStartEndDatetime[] {
  const dates: TaskStartEndDatetime[] = [];
  switch (periodicity_id) {
    case 1: // Ежедневно
      {
        let iDate = moment(task_period_start).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        const period_end = moment(task_period_end).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        while (iDate <= period_end) {
          const nextDate = moment(iDate).add(1, 'days');
          dates.push({
            planned_datetime: iDate.toDate(),
            task_end_datetime: nextDate.toDate(),
          });

          iDate = nextDate;
        }
      }
      break;
    case 2: // Еженедельно
      {
        const period_start = moment(task_period_start).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        const period_end = moment(task_period_end).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        let iDate = period_start;
        while (iDate <= period_end) {
          console.log(period_end);

          console.log(`START: ${iDate} (END: ${period_end})`);

          let startOfWeek = moment(iDate).startOf('isoWeek'); // Start Of Week
          if (period_start > startOfWeek) {
            startOfWeek = moment(period_start);
          }
          console.log(`START OF WEEK: ${startOfWeek}`);

          let endOfWeek = moment(iDate).endOf('isoWeek'); // End Of Week
          if (period_end < endOfWeek) {
            endOfWeek = moment(period_end);
          }
          console.log(`END OF WEEK: ${endOfWeek}`);

          dates.push({
            planned_datetime: startOfWeek.toDate(),
            task_end_datetime: endOfWeek.toDate(),
          });

          console.log(`PERIOD ${startOfWeek.toDate()} - ${endOfWeek.toDate()}`);

          iDate = endOfWeek.add(1, 'days');

          console.log(`END: ${iDate}`);
        }
      }
      break;
    case 3: // Ежемесячно
      {
        const period_start = moment(task_period_start).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        const period_end = moment(task_period_end).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        let iDate = period_start;
        while (iDate <= period_end) {
          console.log(period_end);

          console.log(`START: ${iDate} (END: ${period_end})`);

          let startOfMonth = moment(iDate).startOf('month'); // Start Of Month
          if (period_start > startOfMonth) {
            startOfMonth = moment(period_start);
          }
          console.log(`START OF MONTH: ${startOfMonth}`);

          let endOfMonth = moment(iDate).endOf('month'); // End Of Month
          if (period_end < endOfMonth) {
            endOfMonth = moment(period_end);
          }
          console.log(`END OF MONTH: ${endOfMonth}`);

          dates.push({
            planned_datetime: startOfMonth.toDate(),
            task_end_datetime: endOfMonth.toDate(),
          });

          console.log(
            `PERIOD ${startOfMonth.toDate()} - ${endOfMonth.toDate()}`,
          );

          iDate = endOfMonth.add(1, 'days');

          console.log(`END: ${iDate}`);
        }
      }
      break;
    default:
      throw new Error('Ошибка создания');
  }

  return dates;
}
