import { Component, ChangeDetectorRef } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Events, ModalController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { TripResponseModel } from "../../models/trip-response";
import { TripRequestModel } from "../../models/trip-request";
import { ItineraryModel } from "../../models/itinerary";
import { LegModel } from "../../models/leg";
import { OneClickPlaceModel } from "../../models/one-click-place";
import { OneClickProvider } from '../../providers/one-click/one-click';
import { DirectionsPage } from '../directions/directions';
import { ServiceFor211ModalPage } from '../211/service-for211-modal/service-for211-modal';
import { EmailItineraryModalPage } from "../email-itinerary-modal/email-itinerary-modal";
import { HelpersProvider } from '../../providers/helpers/helpers';


/**
 * Generated class for the DirectionsStepsTabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-directions-steps-tab',
  templateUrl: 'directions-steps-tab.html',
})
export class DirectionsStepsTabPage {
  trip:TripResponseModel;
  mode:string;
  itineraries: ItineraryModel[];
  itinerary: ItineraryModel;
  selectedItinerary: string; // Index of selected itinerary within the itineraries array
  tripRequest:TripRequestModel;
  departAtTime: string; // For storing user-defined depart at time (including date)
  arriveByTime: string; // For storing user-defined arrive by time (including date)
  tripDate: string; // For storing the user-defined trip date (including time)

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClickProvider: OneClickProvider,
              private app: App,
              public events: Events,
              public helpers: HelpersProvider,
              public changeDetector: ChangeDetectorRef,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private translate: TranslateService
  ) {

    this.trip = navParams.data.trip;
    if (navParams.data.itinerary) {
      this.itinerary = navParams.data.itinerary;
      this.itineraries = this.trip.itineraries.slice(0).filter((itin) => itin === this.itinerary).map(function(itin) {
        itin.legs = itin.legs.map(function(legAttrs) {
          return new LegModel().assignAttributes(legAttrs);
        });
        return itin;
      });
    } else {
      this.itineraries = this.trip.itineraries.map(function(itin) {
        itin.legs = itin.legs.map(function(legAttrs) {
          return new LegModel().assignAttributes(legAttrs);
        });
        return itin;
      });

    }
    //this.mode = navParams.data.mode;
    this.selectedItinerary = "0";
    this.tripRequest = new TripRequestModel;
    //this.tripRequest.trip_types = [this.mode]
    this.tripRequest.trip = JSON.parse(JSON.stringify(this.trip)); // Copy the trip into the tripRequest
    this.tripRequest.trip.origin_attributes = new OneClickPlaceModel(this.trip.origin);
    this.tripRequest.trip.destination_attributes = new OneClickPlaceModel(this.trip.destination);

    // Sets trip date, arrive_by and depart_at time
    this.tripDate = this.trip.trip_time;
    this.setArriveByAndDepartAtTimes();
  }

  ionViewDidLoad() { }

  openEmailModal() {
    if (this.itinerary) {
      let emailModal = this.modalCtrl.create(EmailItineraryModalPage, {itinerary: this.itinerary});
      emailModal.present();
    }
  }

  selectService(id: number) {
    this.oneClickProvider.getServiceDetails(id)
      .subscribe((svc) => {

        ServiceFor211ModalPage.createModal(this.modalCtrl,
          this.toastCtrl,
          this.translate,
          { service: svc })
          .present();
      });

  }



  // When depart at time is updated, submit new trip plan request with arrive_by = false
  updateDepartAt(t: string) {
    this.departAtTime = t;
    this.tripRequest.trip.arrive_by = false;
    this.tripRequest.trip.trip_time = this.departAtTime;
    this.replanTrip();
  }

  // When arrive by time is updated, submit new trip plan request with arrive_by = true
  updateArriveBy(t: string) {
    this.arriveByTime = t;
    this.tripRequest.trip.arrive_by = true;
    this.tripRequest.trip.trip_time = this.arriveByTime;
    this.replanTrip();
  }

  // When the trip date is changed, submit a new trip plan request with the new date and same time
  updateTripDate(t: string) {
    this.tripDate = t;
    this.tripRequest.trip.trip_time = this.tripDate;
    this.replanTrip();
  }

  // Makes a new trip request and reloads the Directions page.
  replanTrip() {
    this.events.publish('spinner:show');

    this.oneClickProvider.planTrip(this.tripRequest)
    .subscribe((resp) => {
      let nav = this.app.getRootNav();

      // Insert the new directions page underneat the root page, then pop off the old page.
      nav.insert(nav.length() - 1, DirectionsPage, {
        trip_response: resp,
        mode: this.mode
      }).then(() => {
        nav.pop();
        this.events.publish('spinner:hide');
      });
    });
  }

  // Fires every time a new itinerary is selected
  selectItinerary(evt) {
    this.setArriveByAndDepartAtTimes(); // Update datepicker times based on newly selected itinerary
    this.changeDetector.markForCheck();
  }

  // Sets the arrive by and depart at times in the time pickers based on trip and selected itinerary
  setArriveByAndDepartAtTimes() {
    let h = this.helpers; // for date manipulation methods

    // ITINERARY TIMES
    let itin = this.itineraries[parseInt(this.selectedItinerary)];

    // Have to do some funky math to get these to show up in the proper time zone...
    let itinStartTime:any = new Date(itin.legs[0].startTime).valueOf(); // Convert itinerary start time to milliseconds since epoch
    itinStartTime = h.roundDownToNearest(itinStartTime, 60000 * 15); // Round down to nearest 15 min.
    itinStartTime = h.dateISOStringWithTimeZoneOffset(new Date(itinStartTime)); // Format as ISO String with TZ offset

    let itinEndTime:any = new Date(itin.legs[itin.legs.length - 1].endTime).valueOf(); // Convert itinerary end time to milliseconds since epoch
    itinEndTime = h.roundUpToNearest(itinEndTime, 15 * 60000);  // Round up to nearest 15 min.
    itinEndTime = h.dateISOStringWithTimeZoneOffset(new Date(itinEndTime)); // Format as ISO String with TZ offset

    // TRIP TIMES
    // Trip's trip_time in milliseconds since epoch
    let tripTimeInMS:any = Date.parse(this.trip.trip_time);

    // Round to nearest 15 min (up and down) and format as ISO string with TZ offset
    let tripArriveByTime:any = h.roundUpToNearest(tripTimeInMS, 15 * 60000);
    tripArriveByTime = h.dateISOStringWithTimeZoneOffset(new Date(tripArriveByTime));
    let tripDepartAtTime:any = h.roundDownToNearest(tripTimeInMS, 15 * 60000);
    tripDepartAtTime = h.dateISOStringWithTimeZoneOffset(new Date(tripDepartAtTime));

    // Set arrive by and depart at time to the trip time or the itinerary start/end time,
    // depending on the trip's arrive_by boolean.
    this.arriveByTime = this.trip.arrive_by ? tripArriveByTime : itinEndTime;
    this.departAtTime = this.trip.arrive_by ? itinStartTime : tripDepartAtTime;
  }


}
