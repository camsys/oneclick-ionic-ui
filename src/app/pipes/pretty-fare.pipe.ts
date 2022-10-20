import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
  name: 'prettyFare'
})
export class PrettyFarePipe implements PipeTransform {

  constructor(private translate: TranslateService,
    private i18n: I18nService) { }

    transform(fares: number[]): string {

    // If the fares array is empty, return a fare-unknown message.
    if(fares.length <= 0) {
    return this.translate.instant("oneclick.global.fare.no_fare");
    }

    // Pull out the min and max fares
    let minFare = fares.reduce((f1,f2) => Math.min(f1,f2));
    let maxFare = fares.reduce((f1,f2) => Math.max(f1,f2));

    // If the min and max are the same, return a single fare value.
    if (minFare === maxFare) {
    return this.formatFare(minFare);
    } else {
    // Otherwise, return a range
    return this.formatFare(minFare) + " - " + this.formatFare(maxFare);
    }

    }

    // Formats a number as USD, with no cents.
    formatFare(fare: number): string {
    return new CurrencyPipe(this.i18n.currentLocale())
        .transform(fare, 'USD', true, '1.0-0');
    }


}
