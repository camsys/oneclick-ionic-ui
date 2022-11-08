import { FormControl } from '@angular/forms';

export class PasswordValidator {

  static isValid(control: FormControl): any {
    if(! control.value.includes('@'))
    {
      return {
        "Must contain an @ sign": true
      };
    }
  }
}
