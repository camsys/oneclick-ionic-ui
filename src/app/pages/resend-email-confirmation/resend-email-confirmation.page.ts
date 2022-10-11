import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resend-email-confirmation',
  templateUrl: './resend-email-confirmation.page.html',
  styleUrls: ['./resend-email-confirmation.page.scss'],
})
export class ResendEmailConfirmationPage implements OnInit {
  static routePath: string = '/resend_email_confirmation';

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
        () => {
          this.toastCtrl.create({
            message: this.translate.instant("oneclick.pages.resend_email_confirmation.success_message", {email: this.email}),
            position: "top",
            duration: 3000
          }).then(successToast => successToast.present());
        },
        error => {
          console.error(error);
          this.toastCtrl.create({
            message: this.translate.instant("oneclick.pages.resend_email_confirmation.error_message"),
            position: "top",
            duration: 3000
          }).then(errorToast => errorToast.present());
        }
      );
  }


}
