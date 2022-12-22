import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'prettyDistance'
})
export class PrettyDistancePipe implements PipeTransform {

  constructor(private translate: TranslateService) { }
  
  transform(inputDistance: number, inputUnit: string = 'meters'): string {
    let distanceInFeet = Math.ceil(inputDistance * 3.28084);
    if (distanceInFeet <= 1000) {
      // For short distances (less than 1000 feet), return distance in feet rounded to nearest 10 feet.
      distanceInFeet = Math.round(distanceInFeet / 10) * 10;
      return distanceInFeet + ' ' + this.translate.instant("oneclick.global.distance.feet_short");
    } else {
      // For longer distances, convert to miles and round to 1 decimal place.
      let distanceInMiles = Math.round(distanceInFeet / 5280 * 10) / 10; 
      return distanceInMiles + ' ' + this.translate.instant("oneclick.global.distance.miles_short");
    }
  }

}
