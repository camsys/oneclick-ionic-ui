import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resend-email-confirmation',
  templateUrl: './resend-email-confirmation.page.html',
  styleUrls: ['./resend-email-confirmation.page.scss'],
})
export class ResendEmailConfirmationPage implements OnInit {

  email: string;

  constructor(private auth: AuthService,
              private toastCtrl: ToastController,
              private translate: TranslateService) {
  }

  ngOnInit() {
  }

  resendEmailConfirmation() {
    this.auth.resendEmailConfirmation(this.email)
      .subscribe(
        data => {
          let successToast = this.toastCtrl.create({
            message: this.translate.instant("oneclick.pages.resend_email_confirmation.success_message", {email: this.email}),
            position: "top",
            duration: 3000
          });
          successToast.present();
        },
        error => {
          console.error(error);
          let errorToast = this.toastCtrl.create({
            message: this.translate.instant("oneclick.pages.resend_email_confirmation.error_message"),
            position: "top",
            duration: 3000
          });
          errorToast.present();
        }
      );
  }


}
