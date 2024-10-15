import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Accommodation } from 'src/app/models/accommodation';
import { Eligibility } from 'src/app/models/eligibility';
import { TripType } from 'src/app/models/trip-type';
import { User } from 'src/app/models/user';
import { OneClickService } from 'src/app/services/one-click.service';
import { appConfig } from 'src/environments/appConfig';
import { SignInPage } from '../sign-in/sign-in.page';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  static routePath: string = '/profile';

  user: User = {} as User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];
  trip_types: TripType[];
  filtered_trip_types: TripType[];
  available_locales: string[];
  counties: string[];
  isRegisteredUser: Boolean;

  showParatransitId: boolean = false;

  @ViewChild('updateProfileForm') updateProfileForm: NgForm = {} as NgForm;
  public passwordFieldType = "password";
  public showPassword = false;
  private initialUserParams: any;

  constructor(public navCtrl: NavController,
              private route: ActivatedRoute,
              private router: Router,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public oneClickProvider: OneClickService,
              private translate: TranslateService,
              private authService: AuthService) {
    this.available_locales = appConfig.AVAILABLE_LOCALES;
    this.showParatransitId = appConfig.INCLUDE_PARATRANSIT_ID;
  }

  ngOnInit() {

    this.route.paramMap.subscribe((params: ParamMap) => {
    
      if (this.router.getCurrentNavigation().extras.state) {
          let state = this.router.getCurrentNavigation().extras.state;
          this.initialUserParams = state;
          this.eligibilities = this.initialUserParams.eligibilities;
          this.accommodations = this.initialUserParams.accommodations;
          this.trip_types = this.initialUserParams.trip_types;
          this.user.age = this.initialUserParams.age;
      }
    });


    this.isRegisteredUser = this.authService.isRegisteredUser();
    if (this.isRegisteredUser) {//load user profile info if registered user is logged in
      this.oneClickProvider.getProfile()
      .then((user) => this.updateUserData(user))
      .catch((error) => this.handleError(error))
    }
    else if (this.initialUserParams) {//if have initial params, stay here because user got here from custom profile page
      this.oneClickProvider.getCounties()
      .then((countiesArray) => this.counties = countiesArray.map(county => county.name).sort())
      .catch((error) => this.handleError(error));
    }
    else {//not logged in and user got here by mistake
      this.router.navigateByUrl("/")//profile page is not available
    }
  }

  //update an existing user
  updateProfile(valid:boolean) {
    if (valid) {
      this.user.eligibilities = this.eligibilities;
      this.user.accommodations = this.accommodations;
      this.user.trip_types = this.trip_types;
      if(this.user.password && this.user.password.length > 0) {
        this.user.password_confirmation = this.user.password;
      }
      this.oneClickProvider.updateProfile(this.user)
      .then((user) => this.updateUserDataAndShowMessage(user))
      .catch((error) => this.handleError(error))
    }
    else {
      this.alertCtrl.create({
        header: this.translate.instant("oneclick.global.missing_fields"),
        message: this.translate.instant("oneclick.pages.sign_up.error_messages.email_cant_be_blank"),
        buttons: [this.translate.instant("oneclick.global.ok")],
      }).then(alert => alert.present());
    }
  }

  //do 2-step signup
  createNewUser(valid:boolean) {
    if (valid) {
      this.user.eligibilities = this.eligibilities;
      this.user.accommodations = this.accommodations;
      this.user.trip_types = this.trip_types;
      this.user.password_confirmation = this.user.password;

      this.authService.signUp(
        this.user.email,
        this.user.password,
        this.user.password_confirmation,
        this.user.paratransit_id,
        this.user.county)
        .subscribe({
          next: () => {
            //base user is created so now update profile info
            this.oneClickProvider.updateProfile(this.user)
              .then((user) => {
                this.updateUserData(user)
                this.navCtrl.navigateRoot('/');
              })
              .catch((error) => this.handleError(error));
          },
          error: httpErr => {
            let errors = this.authService.handleSignUpErrors(httpErr);
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
    else {
      this.alertCtrl.create({
        header: this.translate.instant("oneclick.global.missing_fields"),
        message: this.translate.instant("oneclick.pages.sign_up.error_messages.email_cant_be_blank"),
        buttons: [this.translate.instant("oneclick.global.ok")],
      }).then(alert => alert.present());
    }
  }

  showSuccess() {
    // If the user token is expired, redirect to the sign in page and display a notification
    this.toastCtrl.create({
      message: this.translate.instant("oneclick.pages.user_profile.update_profile_success"),
      duration: 5000}
    ).then(toast => toast.present());
  }

  updateUserDataAndShowMessage(user: User) {
    this.updateUserData(user);
    this.showSuccess();
  }

  updateUserData(user: User) {
    this.user = user;
    this.eligibilities = this.user.eligibilities;
    this.accommodations = this.user.accommodations;
    this.trip_types = this.user.trip_types;
    this.counties = this.user.counties.map(county => county.name).sort();
    // Don't filter trip types here so that it matches travel profile page.
    //this.filterTripTypes();
  }

  filterTripTypes() {
    this.filtered_trip_types = [];
    var allowed = ["transit", "paratransit", "car", "taxi", "lyft", "bicycle"];
    for (var i = 0; i < this.user.trip_types.length; i++) {
      if(allowed.indexOf(this.user.trip_types[i].code) > -1){
        this.filtered_trip_types.push(this.user.trip_types[i]);
      }
    }
    this.trip_types = this.filtered_trip_types;
    this.user.trip_types = this.filtered_trip_types;
  }

  handleError(error) {
    // If the user token is expired, redirect to the sign in page and display a notification
    if(error.status === 401) {
      console.error("USER TOKEN EXPIRED", error);
      this.navCtrl.navigateForward(SignInPage.routePath);
      this.toastCtrl.create({
        message: this.translate.instant("oneclick.pages.user_profile.sign_in_required_message"),
        duration: 5000}
      ).then(toast => toast.present());
    } else {
      this.toastCtrl.create({
        message: this.translate.instant("oneclick.pages.user_profile.generic_error_message"),
        duration: 5000}
      ).then(toast => toast.present());

      this.ngOnInit();
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword){
      this.passwordFieldType = "type";
    } else {
      this.passwordFieldType = "password";
    }
  }

}
