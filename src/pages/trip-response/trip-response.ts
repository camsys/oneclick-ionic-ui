import { Component, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { IonicPage, NavController, NavParams,
  Events, ModalController, ToastController,
  Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Pages
import { DirectionsPage } from '../directions/directions';
import { TransportationEligibilityPage } from '../transportation-eligibility/transportation-eligibility';
import { HelpMeFindPage } from '../help-me-find/help-me-find';

// Models
import { TripRequestModel } from "../../models/trip-request";
import { TripResponseModel } from "../../models/trip-response";
import { GooglePlaceModel } from "../../models/google-place";
import { Session } from '../../models/session';
import { ItineraryModel } from "../../models/itinerary";
import { LegModel } from "../../models/leg";

//Providers
import { OneClickProvider } from '../../providers/one-click/one-click';
import { ExternalNavigationProvider } from '../../providers/external-navigation/external-navigation';

//Components
import { PlaceSearchComponent } from "../../components/place-search/place-search";
import { ResponsiveDatepickerComponent } from "../../components/responsive-datepicker/responsive-datepicker";
import { AutocompleteResultsComponent } from "../../components/autocomplete-results/autocomplete-results";

/**
 * Generated class for the TripResponsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-trip-response',
  templateUrl: 'trip-response.html',
})
export class TripResponsePage {

  // Detect when the screen is resized and resize the content based on the
  // new header bar height.
  @ViewChild(Content) content: Content;

  @ViewChild('originSearch') originSearch: PlaceSearchComponent;
  @ViewChild('destinationSearch') destinationSearch: PlaceSearchComponent;
  @ViewChild('tripTimeDatepicker') tripTimeDatepicker: ResponsiveDatepickerComponent;

  @ViewChild('originResults') originResults: AutocompleteResultsComponent;
  @ViewChild('destinationResults') destinationResults: AutocompleteResultsComponent;

  @HostListener('window:resize') onResize() {
    this.content && this.content.resize();
  }

  origin: GooglePlaceModel = new GooglePlaceModel({});
  destination: GooglePlaceModel = new GooglePlaceModel({});
  basicModes:string[] = ['transit', 'car', 'taxi', 'lyft', 'bicycle'] // All available modes except paratransit
  allModes:string[] = ['transit', 'car', 'taxi', 'lyft', 'bicycle', 'paratransit'] // All modes
  tripRequest: TripRequestModel;
  tripResponse: TripResponseModel = new TripResponseModel({});
  tripPlanSubscription: any;
  detailKeys: string[] = []; // Array of the non-null detail keys in the details hash
  arriveBy: boolean;

  itineraries: ItineraryModel[];

  trip_id: number;
  location_id: number;

  transitTime: number = 0;
  driveTime: number = 0;
  bicycleTime: number = 0;

  departureDateTime: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClick: OneClickProvider,
              public events: Events,
              public changeDetector: ChangeDetectorRef,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private translate: TranslateService,
              public exNav: ExternalNavigationProvider,
              private location: Location) {

    this.trip_id = parseInt(this.navParams.data.trip_id);
    this.location_id = parseInt(this.navParams.data.location_id);
    this.arriveBy = this.navParams.data.arriveBy;

    this.events.subscribe('place-search:change', () => {
      this.changeDetector.markForCheck();
    });
  }

  ionViewDidEnter() {
    // Show the spinner until a trip is present
    this.events.publish('spinner:show');

    // If a Trip ID is present, use that to fetch the already-planned trip
    if (this.navParams.data.tripRequest) {
      this.tripRequest = this.navParams.data.tripRequest;
      this.departureDateTime = this.tripRequest.trip.trip_time;
      this.arriveBy = this.tripRequest.trip.arrive_by;

      // Set origin and destination places
      this.origin = new GooglePlaceModel(this.navParams.data.origin);
      this.destination = new GooglePlaceModel(this.navParams.data.destination);

      // Plan a trip and store the result.
      // Once response comes in, update the UI with travel times and allow
      // user to select a mode to view directions.
      this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
        .planTrip(this.tripRequest)
        .subscribe((tripResponse) => {
          this.loadTripResponse(tripResponse);
        });

    } else if(this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
        .subscribe((tripResponse) => this.loadTripResponse(tripResponse))

      // If an origin and destination are passed, make a trip request based on those
    } else if( this.navParams.data.origin && this.navParams.data.destination ) {

      if (this.navParams.data.departureDateTime) {
        this.departureDateTime = this.navParams.data.departureDateTime;
      }

      // Set origin and destination places
      this.origin = new GooglePlaceModel(this.navParams.data.origin);
      this.destination = new GooglePlaceModel(this.navParams.data.destination);

      // Plan a trip and store the result.
      // Once response comes in, update the UI with travel times and allow
      // user to select a mode to view directions.
      this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
        .planTrip(this.buildTripRequest(this.allModes))
        .subscribe((tripResponse) => {
          this.loadTripResponse(tripResponse);
        });

      // Otherwise, go to home page
    } else {
      this.navCtrl.setRoot(HelpMeFindPage);
    }

    this.content.resize(); // Make sure content isn't covered by navbar



  }

  // On page leave, unsubscribe from the trip plan call so it doesn't trigger errors when it resolves
  ionViewWillLeave() {
    if(this.tripPlanSubscription) {
      this.tripPlanSubscription.unsubscribe();
    }

    // on leaving the page, unsubscribe from the place-search events to avoid
    // detecting changes on destroyed views
    this.events.unsubscribe('place-search:change');
    this.events.unsubscribe('place-search:keypress');
  }

  // Loads the page from a OneClick trip response
  loadTripResponse(tripResponse: TripResponseModel) {
    this.tripResponse = new TripResponseModel(tripResponse);
    this.updateTravelTimesFromTripResponse(this.tripResponse);
    this.updateTripPlaces(this.tripResponse);

    this.itineraries = this.tripResponse.itineraries.map(function(itin) {
      itin.legs = itin.legs.map(function(legAttrs) {
        return new LegModel().assignAttributes(legAttrs);
      });
      return itin;
    });

    this.content.resize(); // Make sure content isn't covered by navbar
    this.changeDetector.markForCheck(); // using markForCheck instead of detectChanges fixes view destroyed error
    this.events.publish('spinner:hide');
  }

  // Plans a trip based on origin and destination
  findTransportation(origin: GooglePlaceModel,
                     destination: GooglePlaceModel, time: string) {

    this.origin = new GooglePlaceModel(origin);
    this.destination = new GooglePlaceModel(destination);
    this.departureDateTime = time;

    // Set origin and destination
    this.tripRequest.trip.origin_attributes = this.origin.toOneClickPlace();
    this.tripRequest.trip.destination_attributes = this.destination.toOneClickPlace();

    // Set trip time to now by default, in ISO 8601 format
    if (this.departureDateTime == undefined) {
      this.tripRequest.trip.trip_time = new Date().toISOString();
    } else {
      this.tripRequest.trip.trip_time = this.departureDateTime;
    }

    // Set arrive_by to true by default
    this.tripRequest.trip.arrive_by = this.arriveBy;

    // Plan a trip and store the result.
    // Once response comes in, update the UI with travel times and allow
    // user to select a mode to view directions.
    this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
      .planTrip(this.tripRequest)
      .subscribe((tripResponse) => {
        this.loadTripResponse(tripResponse);
      });
  }


  openDirectionsPageForItinerary(itinerary: ItineraryModel) {
    let tripResponse = this.tripResponse;

    this.navCtrl.push(DirectionsPage, {
      trip_response: tripResponse,
      trip_id: tripResponse.id,
      itinerary: itinerary
    });
  }

  openOtherTransportationOptions(){
    // Plan a trip and store the result.
    // Once response comes in, update the UI with travel times and allow
    // user to select a mode to view directions.

    this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
      .planTrip(this.buildTripRequest(this.tripRequest.trip_types))
      .subscribe((tripResponse) => {
        this.loadTripResponse(tripResponse);

        this.navCtrl.push(TransportationEligibilityPage, {
          trip_response: this.tripResponse,
          trip_request: this.tripRequest,
          trip_id: this.trip_id,
          origin: this.origin,
          destination: this.destination
        })
      });


  }

  // Builds a trip request based on the passed mode, stored origin/destination,
  // and current time
  buildTripRequest(modes: string[]) {
    let tripRequest = this.tripRequest = new TripRequestModel();

    // Set origin and destination
    tripRequest.trip.origin_attributes = this.origin.toOneClickPlace();
    tripRequest.trip.destination_attributes = this.destination.toOneClickPlace();

    // Set trip time to now by default, in ISO 8601 format
    if (this.departureDateTime == undefined) {
      tripRequest.trip.trip_time = new Date().toISOString();
    } else {
      tripRequest.trip.trip_time = this.departureDateTime;
    }

    // Set arrive_by to true by default
    tripRequest.trip.arrive_by = this.arriveBy;

    // Set trip types to the mode passed to this method
    tripRequest.trip_types = modes;

    // Don't filter by schedule, because we aren't letting the user pick a time for paratransit or taxi
    // Also don't filter by eligibility, as doing so may exclude relevant results from the fare preview
    this.tripRequest.except_filters = ["schedule", "eligibility"];

    return tripRequest;
  }

  // Updates transit and drive time based on a trip response
  updateTravelTimesFromTripResponse(tripResponse: TripResponseModel) {
    let transitItin = tripResponse.itinerariesByTripType('transit')[0];
    if(transitItin && transitItin.duration) {
      this.transitTime = transitItin.duration;
    }

    let driveItin = tripResponse.itinerariesByTripType('car')[0];
    if(driveItin && driveItin.duration) {
      this.driveTime = driveItin.duration;
    }

    let bicycleItin = tripResponse.itinerariesByTripType('bicycle')[0];
    if(bicycleItin && bicycleItin.duration) {
      this.bicycleTime = bicycleItin.duration;
    }
  }

  // Updates the origin and destination based on the trip response
  updateTripPlaces(tripResponse: TripResponseModel) {
    this.originSearch.setPlace(this.origin);
    this.destinationSearch.setPlace(this.destination);
  }

  // Returns duration in seconds for the given mode
  durationFor(mode:string): number {
    switch(mode) {
      case 'transit':
        return this.transitTime;
      case 'car':
      case 'taxi':
        return this.driveTime;
      case 'lyft':
        return this.driveTime;
      case 'paratransit':
        return this.driveTime;
      case 'bicycle':
        return this.bicycleTime;
      default:
        return this.driveTime;
    }
  }

  // Returns a label for the passed mode
  labelFor(mode:string): string {
    switch(mode) {
      case 'transit':
        return "Bus & Train";
      case 'car':
        return "Drive";
      case 'taxi':
        return "Taxi";
      case 'lyft':
        return "Lyft";
      case 'paratransit':
        return "Other Transportation Options";
      default:
        return "";
    }
  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

}
