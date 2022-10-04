import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyFare'
})
export class PrettyFarePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
