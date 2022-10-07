import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Accommodation } from 'src/app/models/accommodation';
import { Eligibility } from 'src/app/models/eligibility';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { TripRequestModel } from 'src/app/models/trip-request';
import { TripResponseModel } from 'src/app/models/trip-response';
import { TripType } from 'src/app/models/trip-type';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-transportation-eligibility',
  templateUrl: './transportation-eligibility.page.html',
  styleUrls: ['./transportation-eligibility.page.scss'],
})
export class TransportationEligibilityPage implements OnInit {

  origin: GooglePlaceModel = new GooglePlaceModel({});
  destination: GooglePlaceModel = new GooglePlaceModel({});
  user: User;
  age: number;
  accommodations: Accommodation[] = [];
  eligibilities: Eligibility[] = [];
  trip_types: TripType[] = [];
  tripResponse: TripResponseModel=null;
  tripRequest: TripRequestModel;

  trip_id: number;

  user_preferences_disabled: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              private auth: AuthService,
              public oneClick: OneClickService,
              private changeDetector: ChangeDetectorRef,
              private translate: TranslateService,
              public events: Events) {

    this.events.publish('spinner:show');
    this.trip_id = parseInt(navParams.data.trip_id);

  }

  ngOnInit() {

    // Set origin and destination places
    this.origin = new GooglePlaceModel(this.navParams.data.origin);
    this.destination = new GooglePlaceModel(this.navParams.data.destination);

    if(this.navParams.data.trip_request) {

      this.loadTripResponse();
      this.loadTripRequest(this.navParams.data.trip_request);
    } else {
      // If necessary NavParams are not present, go to home page
      this.navCtrl.setRoot(HelpMeFindPage);
    }

    // reset hiding this page since user opened it
    let session = this.auth.session();
    session.user_preferences_disabled = false;
    this.auth.setSession(session);

  }

  // Loads trip response data onto the page
  loadTripResponse() {

    this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
      .newTrip()
      .subscribe((tripResponse) => {
        this.tripResponse = new TripResponseModel(tripResponse);

        // Pull out the relevant accommodations and eligibilities
        this.accommodations = this.tripResponse.all_accommodations;
        this.eligibilities = this.tripResponse.all_eligibilities;
        this.trip_types = this.tripResponse.all_trip_types;

        // If user is logged in or guest user exists, set the values for the eligibilities and accommodations based on their saved info
        if(this.auth.isRegisteredUser() || this.auth.session().user) {
          this.user = this.auth.session().user;
          this.age = this.user.age;
          this.setAccomEligAndTripTypeValues();
        } else {
          this.trip_types.map((trip_type) => {
            trip_type.value = true;
          });
        }
    });

    this.events.publish("spinner:hide");
    this.changeDetector.markForCheck();
  }

  // Loads trip request data into the page
  loadTripRequest(tripRequest: TripRequestModel) {
    // Set up a tripRequest to make if any of the accommodation or eligibility values are changed
    this.tripRequest = tripRequest;
  }

  // Method fires every time an accommodation or eligibility is selected or unselected
  updateCharacteristic() {
    this.changeDetector.markForCheck();
  }

  // Builds a user_profile update hash based on the accommodations and eligiblities hashes
  buildUserProfileParams() {
    let accs = this.accommodations.reduce((accHash, acc) => {
      accHash[acc.code] = acc.value;
      return accHash;
    }, {});
    let eligs = this.eligibilities.reduce((eligHash, elig) => {
      eligHash[elig.code] = elig.value;
      return eligHash;
    }, {});
    let trip_types = this.trip_types.reduce((tripTypeHash, trip_type) => {
      tripTypeHash[trip_type.code] = trip_type.value;
      return tripTypeHash;
    }, {});
    let age = this.age;
    this.tripRequest.user_profile = {
      attributes: {age: age},
      accommodations: accs,
      eligibilities: eligs,
      trip_types: trip_types,
      age: age
    };
    this.tripRequest.trip_types = this.trip_types
      .filter((trip_type) => trip_type.value)
      .map((trip_type) => {
      return trip_type.code;
    });

    if (this.tripRequest.trip_types.findIndex((tt) => tt === 'paratransit') >= 0) {
      this.tripRequest.except_filters = ["schedule"]; // Don't filter by schedule, because we aren't letting the user pick a time
    }

  }

  // Shows all available paratransit options based on selected accommodations and eligibilities
  viewParatransitOptions() {
    this.events.publish('spinner:show');
    this.buildUserProfileParams();
    this.navCtrl.push(TripResponsePage, {
      tripRequest: this.tripRequest,
      origin: this.origin,
      destination: this.destination,
      skipPreferences: true
    });
  }

  storeUserPreferencesDisabledInSession() {
    let session = this.auth.session();
    session.user_preferences_disabled = this.user_preferences_disabled;
    this.auth.setSession(session);

    this.toastCtrl.create({
      message: "Session updated",
      duration: 5000}
    ).present();
  }
  storeUserPreferencesDisabledInSessionByButton() {
    this.user_preferences_disabled = !this.user_preferences_disabled;
    this.storeUserPreferencesDisabledInSession();
  }


  setAccomEligAndTripTypeValues() {
    this.accommodations.map((acc) => {
      let userAcc = this.user.accommodations.find((usrAccom) => usrAccom.code === acc.code);
      if (userAcc) {
        acc.value = userAcc.value;
      }
    });
    this.eligibilities.map((elig) => {
      let userElig = this.user.eligibilities.find((usrElig) => usrElig.code === elig.code);
      if (userElig) {
        elig.value = userElig.value;
      }
    });
    this.trip_types.map((trip_type) => {
      let userTripType = this.user.trip_types.find((usrTripType) => usrTripType.code === trip_type.code);
      if (userTripType) {
        trip_type.value = userTripType.value;
      }

    });

  }

  async showRegistrationPopup() {
    let alert = await this.alertCtrl.create({
      message: this.translate.instant('oneclick.pages.transportation_eligibility.create_account_popup'),
      buttons: ['OK'],
    });

    await alert.present();
  }
  async showTripTypesPopup() {
    let alert = await this.alertCtrl.create({
      message: this.translate.instant('oneclick.pages.transportation_eligibility.trip_types_info_popup'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showAccommodationsPopup() {
    let alert = await this.alertCtrl.create({
      message: this.translate.instant('oneclick.pages.transportation_eligibility.accommodations_info_popup'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showEligibilitiesPopup() {
    let alert = await this.alertCtrl.create({
      message: this.translate.instant('oneclick.pages.transportation_eligibility.eligibilities_info_popup'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showAgePopup() {
    let alert = await this.alertCtrl.create({
      message: this.translate.instant('oneclick.pages.transportation_eligibility.age_info_popup'),
      buttons: ['OK'],
    });

    await alert.present();
  }


}
