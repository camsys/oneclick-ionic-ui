import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyTableName'
})
export class PrettyTableNamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
