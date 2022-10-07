import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { County } from 'src/app/models/county';
import { AuthService } from 'src/app/services/auth.service';
import { ExternalNavigationService } from 'src/app/services/external-navigation.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { EmailAddressValidator } from 'src/app/validators/email-address';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

 
  // formControlEmail: FormControl;
  // formControlPassword: FormControl;
  // formControlPasswordConfirm: FormControl;
  signUpFormGroup: FormGroup;
  submitAttempt: boolean = false;
  errorToast: Toast;
  counties: string[];

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              private authProvider: AuthService,
              private toastCtrl: ToastController,
              public oneClickProvider: OneClickService,
              private translate: TranslateService,
              public exNav: ExternalNavigationService) {

    this.signUpFormGroup = formBuilder.group({
      formControlEmail: ['', Validators.compose([Validators.required, EmailAddressValidator.isValid, Validators.maxLength(30),])],
      formControlPassword: ['', Validators.compose([Validators.required])],
      formControlPasswordConfirm: ['', Validators.compose([Validators.required])],
      formControlParatransitId: ['', Validators.maxLength(30)],
      formControlCounty: [''],
    });
    this.errorToast = this.toastCtrl.create({});
  }

  ngOnInit() {
    this.oneClickProvider.getCounties()
    .then((countiesArray) => this.updateUserData(countiesArray))
    .catch((error) => this.handleError(error))
  }

  updateUserData(countiesArray: County[]) {
    this.counties = countiesArray.map(county => county.name).sort();
  }

  handleError(error) {
    this.toastCtrl.create({
      message: this.translate.instant("oneclick.pages.user_profile.generic_error_message"),
      duration: 5000}
    ).present();
  }

  signUp() {

      this.authProvider
        .signUp(this.signUpFormGroup.controls.formControlEmail.value, 
          this.signUpFormGroup.controls.formControlPassword.value, 
          this.signUpFormGroup.controls.formControlPasswordConfirm.value,
          this.signUpFormGroup.controls.formControlParatransitId.value,
          this.signUpFormGroup.controls.formControlCounty.value)
        .subscribe(
          data => {this.navCtrl.setRoot(HelpMeFindPage);},
          error => {
            let errors: string = '';
            errors = this.translate.instant("oneclick.pages.sign_up.error_messages.default");

            if(error.json().data.errors.email == 'is invalid')
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.email_bad");
            }
            if(error.json().data.errors.email == 'has already been taken')
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.email_used");
            }
            if(error.json().data.errors.email == 'is too short (minimum is 6 characters)')
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.password_bad");
            }
            if(error.json().data.errors.password_confirmation == "doesn't match Password")
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.password_mismatch");
            }
            if(error.json().data.errors.password == "must include at least one letter and one digit")
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.password_not_complex");
            }
            if(error.json().data.errors.email == "can't be blank")
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.email_cant_be_blank");
            }
            if(error.json().data.errors.password == "can't be blank")
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.password_cant_be_blank");
            }
            if(error.json().data.errors.password_confirmation == "can't be blank")
            {
              errors += this.translate.instant("oneclick.pages.sign_up.error_messages.password_confirmation_cant_be_blank");
            }
            
            this.errorToast.dismissAll();

            this.errorToast = this.toastCtrl.create({
              message: errors,
              dismissOnPageChange: true,
              position: "top",
              duration: 10000
            });
            this.errorToast.present();
          });
  }


}
