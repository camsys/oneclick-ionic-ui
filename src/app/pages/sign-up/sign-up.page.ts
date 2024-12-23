import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '../../../environments/appConfig';
import { County } from 'src/app/models/county';
import { AuthService } from 'src/app/services/auth.service';
import { ExternalNavigationService } from 'src/app/services/external-navigation.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { EmailAddressValidator } from 'src/app/validators/email-address';
import { HelpMeFindPage } from '../help-me-find/help-me-find.page';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  static routePath: string = '/sign_up';

 
  // formControlEmail: FormControl;
  // formControlPassword: FormControl;
  // formControlPasswordConfirm: FormControl;
  signUpFormGroup: FormGroup;
  submitAttempt: boolean = false;
  counties: string[];

  oneClickPrivacyPolicyURL: string;
  showParatransitId: boolean = false;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              private authProvider: AuthService,
              private toastCtrl: ToastController,
              public oneClickProvider: OneClickService,
              private translate: TranslateService,
              public exNav: ExternalNavigationService) {

                this.oneClickPrivacyPolicyURL = appConfig.ONE_CLICK_PRIVACY_POLICY_URL;
                this.showParatransitId = appConfig.INCLUDE_PARATRANSIT_ID;

    this.signUpFormGroup = formBuilder.group({
      formControlEmail: ['', Validators.compose([Validators.required, EmailAddressValidator.isValid, Validators.maxLength(30),])],
      formControlPassword: ['', Validators.compose([Validators.required])],
      formControlPasswordConfirm: ['', Validators.compose([Validators.required])],
      formControlParatransitId: ['', Validators.maxLength(30)],
      formControlCounty: [''],
    });
  }

  ngOnInit() {
    this.oneClickProvider.getCounties()
    .then((countiesArray) => this.updateUserData(countiesArray))
    .catch((error) => this.handleError(error))
  }

  ionViewDidLeave() {
    this.toastCtrl.dismiss().catch(()=>{
      //this will catch the error if there is no toast to dismiss
    });
  }

  updateUserData(countiesArray: County[]) {
    this.counties = countiesArray.map(county => county.name).sort();
  }

  handleError(error) {
    this.toastCtrl.create({
      message: this.translate.instant("oneclick.pages.user_profile.generic_error_message"),
      duration: 5000}
    ).then(toast => toast.present());
  }

  signUp() {

      this.authProvider
        .signUp(this.signUpFormGroup.controls.formControlEmail.value, 
          this.signUpFormGroup.controls.formControlPassword.value, 
          this.signUpFormGroup.controls.formControlPasswordConfirm.value,
          this.signUpFormGroup.controls.formControlParatransitId.value,
          this.signUpFormGroup.controls.formControlCounty.value)
        .subscribe({
          next: () => {
            this.navCtrl.navigateRoot('/');
          },
          error: httpErr => {
            let errors = this.authProvider.handleSignUpErrors(httpErr);
            this.toastCtrl.dismiss().catch(()=>{
              //this will catch the error if there is no toast to dismiss
            }).finally(()=>{
              this.toastCtrl.create({
                message: errors.join(". ").replace("..", "."),//join all error messages with period and space but remove any double periods just in case
                position: "top",
                duration: 10000
              }).then(errorToast => errorToast.present());
            });
          }
        });
  }


}
