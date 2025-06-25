import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup-callback',
  template: `<p>Loading...</p>`,
})
export class SignupCallbackComponent {
  constructor(private auth: AuthService) {}

  //use ionViewDidEnter because every time this page is opened, we need to log this user in with OCC
  ionViewDidEnter(): void {
    console.log("Successful signup and authentication with Auth0")
    this.auth.finishAuth0Login('/profile');
  }
}
