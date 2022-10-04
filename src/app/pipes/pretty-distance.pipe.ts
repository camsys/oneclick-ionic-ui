import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyDistance'
})
export class PrettyDistancePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
