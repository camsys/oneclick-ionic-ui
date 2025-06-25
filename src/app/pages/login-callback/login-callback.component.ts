import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login-callback',
  template: `<p>Loading...</p>`,
})
export class LoginCallbackComponent {
  constructor(private auth: AuthService) {}

  //use ionViewDidEnter because every time this page is opened, we need to log this user in with OCC
  ionViewDidEnter(): void {
    console.log("Successful authentication with Auth0")
    this.auth.finishAuth0Login('/home');
  }
}
