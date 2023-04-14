

import {Component, ContentChild} from '@angular/core';
import {IonInput} from '@ionic/angular';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss']
})
export class ShowHidePasswordComponent {
  showPassword = false;
  label:string = "show-password"
  @ContentChild(IonInput) input: IonInput;

  constructor() {}

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.label = this.showPassword ? 'hide-password': 'show-password';
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
