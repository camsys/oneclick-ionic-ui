import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'prettyTime'
})
export class PrettyTimePipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(seconds: number | null | undefined): string {
    if(seconds == 0) { return (0 + " " + this.translate.instant("oneclick.global.time.minute_short"));}
    if(!seconds) { return this.translate.instant("oneclick.global.time.unknown"); } // Return string "unknown" if value is null
    let timeString = "";

    // populate hours
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    if(hours > 0) {
      timeString += (hours + " " + this.translate.instant("oneclick.global.time.hour_short") + " ");
    }

    // populate minutes
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    if(minutes > 0) {
      timeString += (minutes + " " + this.translate.instant("oneclick.global.time.minute_short"));
    }

    return timeString;
  }

}
