import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  user: User = { email: null, password: null } as User;
  signInSubscription: any;
  errorToast: Toast;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authProvider: AuthService,
              private oneClickProvider: OneClickService,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private events: Events) {
    this.errorToast = this.toastCtrl.create({});
  }

  ngOnInit() {
  }

  signIn() {
    this.authProvider
        .signIn(this.user.email, this.user.password)
        .subscribe(
          data => {
            // Get the user's profile data and store it in the session
            this.oneClickProvider.getProfile()
                // Then, redirect the user to the home page
                .then((usr) => {
                  this.navCtrl.setRoot(HelpMeFindPage);
                });
          },
          error => {
            // On failed response, display a pop-up error message and remain on page.
            console.error(error.json().data.errors);
            let errorBody = error.json().data.errors;

            // Based on which log in attempt this is, customize the error message
            let errorCode = '';
            if (errorBody.last_attempt) {
              errorCode = 'last_attempt';
            } else if (errorBody.locked) {
              errorCode = 'locked';
            } else if (errorBody.unconfirmed){
              errorCode = 'unconfirmed';
            } else {
              errorCode = 'default';
            }

            this.errorToast.dismissAll();

            let errorToast = this.toastCtrl.create({
              message: this.translate.instant("oneclick.pages.sign_in.error_messages." + errorCode),
              position: "top",
              duration: 3000
            });
            errorToast.present();
          }
        );
  }

  signUp(){
    this.navCtrl.push(SignUpPage);
  }

  resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

  resendConfirmation() {
    this.navCtrl.push(ResendEmailConfirmationPage);
  }


}
