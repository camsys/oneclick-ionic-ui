import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleTime'
})
export class ScheduleTimePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
