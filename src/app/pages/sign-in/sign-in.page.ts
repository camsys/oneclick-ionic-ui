import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { HelpMeFindPage } from '../help-me-find/help-me-find.page';
import { ResendEmailConfirmationPage } from '../resend-email-confirmation/resend-email-confirmation.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { SignUpPage } from '../sign-up/sign-up.page';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  static routePath:string = '/sign_in';

  user: User = { email: null, password: null } as User;
  signInSubscription: any;

  constructor(public navCtrl: NavController,
              private authProvider: AuthService,
              private oneClickProvider: OneClickService,
              private toastCtrl: ToastController,
              private translate: TranslateService) {
  }

  ngOnInit() {
  }

  signIn() {
    this.authProvider
        .signIn(this.user.email, this.user.password)
        .subscribe(
          () => {
            // Get the user's profile data and store it in the session
            this.oneClickProvider.getProfile()
                // Then, redirect the user to the home page
                .then(() => {
                  this.navCtrl.navigateRoot(HelpMeFindPage.routePath);
                });
          },
          (error) => {
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

            
            this.toastCtrl.dismiss().catch(()=>{
              //this will catch the error if there is no toast to dismiss
            }).finally(()=>{
              this.toastCtrl.create({
                message: this.translate.instant("oneclick.pages.sign_in.error_messages." + errorCode),
                position: "top",
                duration: 3000
              }).then(errorToast => errorToast.present());
            });

            
          }
        );
  }

  signUp(){
    this.navCtrl.navigateForward(SignUpPage.routePath);
  }

  resetPassword() {
    this.navCtrl.navigateForward(ResetPasswordPage.routePath);
  }

  resendConfirmation() {
    this.navCtrl.navigateForward(ResendEmailConfirmationPage.routePath);
  }


}
