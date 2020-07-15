import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { HelpMeFindPage } from '../help-me-find/help-me-find';
import { DirectionsStepsTabPage } from '../directions-steps-tab/directions-steps-tab';
import { DirectionsMapTabPage } from '../directions-map-tab/directions-map-tab';

import { TripResponseModel } from "../../models/trip-response";
import { ItineraryModel } from "../../models/itinerary";

import { OneClickProvider } from "../../providers/one-click/one-click";

/**
 * Generated class for the DirectionsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions',
  templateUrl: 'directions.html',
})
export class DirectionsPage {

  trip: TripResponseModel = new TripResponseModel({});
  mode: string = "";
  stepsTab: any;
  mapTab: any;
  directionsParams: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private oneClick: OneClickProvider) {
    let navData = this.navParams.data;

    this.stepsTab = DirectionsStepsTabPage;
    this.mapTab = DirectionsMapTabPage;

    if(navData.trip_response) {
      if (navData.itinerary) {
        this.displayItineraryResults(navData.trip_response, navData.itinerary);
      } else {
        this.displayTripResults(navData.trip_response);
      }

    } else if(navData.trip_id) {
      this.oneClick.getTrip(this.navParams.data.trip_id)
          .subscribe((trip) => {
            let newTripResponse = new TripResponseModel(trip) //.withFilteredItineraries(navData.mode);
            this.displayTripResults(newTripResponse);
          });



    } else {
      this.navCtrl.setRoot(HelpMeFindPage); // If necessary navParams aren't present, go back to the home page
    }
  }

  ionViewDidLoad() {

  }

  displayTripResults(trip: TripResponseModel): void {
    this.trip = trip;
    this.directionsParams = {
      trip: this.trip
    }
  }

  displayItineraryResults(trip: TripResponseModel, itinerary: ItineraryModel): void {
    this.trip = trip;
    this.directionsParams = {
      trip: this.trip,
      itinerary: itinerary

    }
  }


}
