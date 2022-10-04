import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleDay'
})
export class ScheduleDayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
