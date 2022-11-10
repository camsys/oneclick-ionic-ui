import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Accommodation } from 'src/app/models/accommodation';
import { Eligibility } from 'src/app/models/eligibility';
import { TripType } from 'src/app/models/trip-type';
import { User } from 'src/app/models/user';
import { OneClickService } from 'src/app/services/one-click.service';
import { appConfig } from 'src/environments/appConfig';
import { environment } from 'src/environments/environment';
import { SignInPage } from '../sign-in/sign-in.page';

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

  @ViewChild('updateProfileForm') updateProfileForm: NgForm = {} as NgForm;
  public passwordFieldType = "password";
  public showPassword = false;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public oneClickProvider: OneClickService,
              private translate: TranslateService) {
    this.available_locales = appConfig.AVAILABLE_LOCALES;
  }

  ngOnInit() {
    this.oneClickProvider.getProfile()
    .then((user) => this.updateUserData(user))
    .catch((error) => this.handleError(error))
  }

  updateProfile() {
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
