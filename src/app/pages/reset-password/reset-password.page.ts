import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email: string;

  constructor(private auth: AuthService,
              private toastCtrl: ToastController,
              private translate: TranslateService) {
  }

  ngOnInit() {
  }

  resetPassword() {
    this.auth.resetPassword(this.email)
             .subscribe(
        data => {
          let successToast = this.toastCtrl.create({
            message: this.translate.instant("oneclick.pages.reset_password.success_message", { email: this.email }),
            position: "top",
            duration: 3000
          });
          successToast.present();
        },
        error => {
          console.error(error);
          let errorToast = this.toastCtrl.create({
            message: this.translate.instant("oneclick.pages.reset_password.error_message"),
            position: "top",
            duration: 3000
          });
          errorToast.present();
        }
      );
  }


}
