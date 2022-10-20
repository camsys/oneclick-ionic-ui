import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhoneNumber'
})
export class FormatPhoneNumberPipe implements PipeTransform {

  transform(phoneNumber: string): string {
    let formattedNumber = "(" + phoneNumber.slice(0,3) + ") " 
                              + phoneNumber.slice(3,6) + "-" 
                              + phoneNumber.slice(6)
    return formattedNumber;
  }

}
