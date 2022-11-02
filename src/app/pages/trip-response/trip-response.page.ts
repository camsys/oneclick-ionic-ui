import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertController, IonSelect, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteResultsComponent } from 'src/app/components/autocomplete-results/autocomplete-results.component';
import { PlaceSearchComponent } from 'src/app/components/place-search/place-search.component';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { ItineraryModel } from 'src/app/models/itinerary';
import { LegModel } from 'src/app/models/leg';
import { Session } from 'src/app/models/session';
import { TripRequestModel } from 'src/app/models/trip-request';
import { TripResponseModel } from 'src/app/models/trip-response';
import { AuthService } from 'src/app/services/auth.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { LoaderService } from 'src/app/services/loader.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { DirectionsPage } from '../directions/directions.page';
import { HelpMeFindPage } from '../help-me-find/help-me-find.page';
import { ParatransitServicesPage } from '../paratransit-services/paratransit-services.page';
import { TransportationEligibilityPage } from '../transportation-eligibility/transportation-eligibility.page';

@Component({
  selector: 'app-trip-response',
  templateUrl: './trip-response.page.html',
  styleUrls: ['./trip-response.page.scss'],
})
export class TripResponsePage implements OnInit {
  static routePath:string = "/trip_options";

  @ViewChild('originSearch') originSearch: PlaceSearchComponent;
  @ViewChild('destinationSearch') destinationSearch: PlaceSearchComponent;

  @ViewChild('originResults') originResults: AutocompleteResultsComponent;
  @ViewChild('destinationResults') destinationResults: AutocompleteResultsComponent;

  origin: GooglePlaceModel = new GooglePlaceModel({});
  destination: GooglePlaceModel = new GooglePlaceModel({});
  basicModes:string[] = ['transit', 'car', 'taxi', 'lyft', 'bicycle'] // All available modes except paratransit
  allModes:string[] = ['transit', 'car', 'taxi', 'lyft', 'bicycle', 'paratransit'] // All modes
  tripRequest: TripRequestModel;
  tripResponse: TripResponseModel = new TripResponseModel({});
  tripPlanSubscription: any;
  detailKeys: string[] = []; // Array of the non-null detail keys in the details hash
  arriveBy: boolean =true;
  departureDateTime: string;
  departureDateTimeParam: string;

  departureDate: Date;
  departureTime: Date;

  originInvalid: boolean = false;
  destinationInvalid: boolean = false;

  itineraries: ItineraryModel[];
  orderBy: String;

  trip_id: number;
  location_id: string;

  transitTime: number = 0;
  driveTime: number = 0;
  bicycleTime: number = 0;

  skipPreferences: boolean = false;

  can_plan_trips: boolean = false;

  constructor(public navCtrl: NavController,
              private route: ActivatedRoute,
              private router: Router,
              public oneClick: OneClickService,
              public changeDetector: ChangeDetectorRef,
              private helpers: HelpersService,
              private auth: AuthService,
              private loader: LoaderService,
              public alertController: AlertController,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      
      this.trip_id = +params.get('trip_id');
      this.location_id = params.get('location_id');

      if (this.router.getCurrentNavigation().extras.state) {

        this.arriveBy = this.router.getCurrentNavigation().extras.state.arriveBy;
        this.skipPreferences = this.router.getCurrentNavigation().extras.state.skipPreferences;
        this.tripRequest = this.router.getCurrentNavigation().extras.state.tripRequest;
        this.origin = this.router.getCurrentNavigation().extras.state.origin;
        this.destination = this.router.getCurrentNavigation().extras.state.destination;
        this.departureDateTimeParam = this.router.getCurrentNavigation().extras.state.departureDateTime;

        //to make sure select for depart/arrive updates correctly
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ionViewDidEnter() {
    // Show the spinner until a trip is present
    this.loader.showLoader();

    // If a Trip ID is present, use that to fetch the already-planned trip
    if (!this.trip_id && this.tripRequest) {
      
      this.departureDateTime = this.tripRequest.trip.trip_time;
      this.arriveBy = this.tripRequest.trip.arrive_by;

      if (!this.auth.session().user_preferences_disabled && !this.skipPreferences) {
        this.router.navigate([TransportationEligibilityPage.routePath, this.trip_id], {
          state: {
            trip_request: this.tripRequest,
            origin: this.origin,
            destination: this.destination
          }
        });
      } else {
        // Plan a trip and store the result.
        // Once response comes in, update the UI with travel times and allow
        // user to select a mode to view directions.
        this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
        .planTrip(this.tripRequest)
        .subscribe((tripResponse) => {
          this.loadTripResponse(tripResponse);
        });
      }

    } else if(this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
        .subscribe((tripResponse) => this.loadTripResponse(tripResponse))

      // If an origin and destination are passed, make a trip request based on those
    } else if (this.origin && this.destination) {

      if (this.departureDateTimeParam) this.departureDateTime = this.departureDateTimeParam;

      this.buildTripRequest(this.allModes);

      if (!this.auth.session().user_preferences_disabled && !this.skipPreferences) {

        this.router.navigate([TransportationEligibilityPage.routePath, this.trip_id], {
            state: {
              trip_request: this.tripRequest,
              origin: this.origin,
              destination: this.destination
            }
          });
      } else {
        // Plan a trip and store the result.
        // Once response comes in, update the UI with travel times and allow
        // user to select a mode to view directions.
        this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
          .planTrip(this.tripRequest)
          .subscribe((tripResponse) => {
            this.loadTripResponse(tripResponse);
          });
      }


      // Otherwise, go to home page
    } else {
      this.navCtrl.navigateRoot(HelpMeFindPage.routePath);
    }
    //to make sure select for arrive/depart updates correctly
    this.changeDetectorRef.detectChanges();
  }

  // On page leave, unsubscribe from the trip plan call so it doesn't trigger errors when it resolves
  ionViewWillLeave() {
    if(this.tripPlanSubscription) {
      this.tripPlanSubscription.unsubscribe();
    }
  }

  arriveBySelectChanged(e) {
    this.arriveBy = e.detail.value;
  }

  placeSearchChanged() {
    this.changeDetector.markForCheck();
  }

  // Orders the match list based on the passed string
  orderItinList() {
    if(this.orderBy == "duration") {
      this.orderByDuration();
    } else if(this.orderBy == "walk_distance") {
      this.orderByWalkDistance();
    } else if(this.orderBy == 'cost') {
      this.orderByCost();
    } else if(this.orderBy == 'endTime') {
      this.orderByEndTime();
    } else if(this.orderBy == 'wait_time') {
      this.orderByWaitTime();
    } else {
      this.orderByParatransit();
    }
    //this.orderBy = orderBy;
  }

  orderByDuration()
  {
    let h = this.helpers;
    return this.itineraries.sort(function (a : ItineraryModel, b : ItineraryModel) {
      //sorts by shortest duration
      return h.compareTimes(a.duration, b.duration);
    })
  }

  orderByWalkDistance()
  {
    return this.itineraries.sort(function (a : ItineraryModel, b : ItineraryModel) {
      //sorts by shortest walk distance
      return a.walk_distance - b.walk_distance;
    })
  }

  orderByParatransit()
  {
    return this.itineraries.sort(function (a : ItineraryModel, b : ItineraryModel) {
      //sorts by paratransit first
      if ((a.trip_type == 'paratransit') && (b.trip_type != 'paratransit')) {
        return -1;
      } else if  ((b.trip_type == 'paratransit') && (a.trip_type != 'paratransit')) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  orderByCost()
  {
    return this.itineraries.sort(function (a : ItineraryModel, b : ItineraryModel) {
      //sorts by smallest cost
      // sort nil first - which is car, bike, walking
      // sort nils that are unknowns next
      // then ones with known costs in asc
      // used 2000 as no fare will likely be more in cost
      if (a.cost == null) {
        if (a.trip_type == 'car' || a.trip_type == 'bicycle' || a.trip_type == 'walk') {
          return -2000;
        } else {
          return -1999;
        }
      } else if (b.cost == null && a.cost != null) {
        if (b.trip_type == 'car' ||b.trip_type == 'bicycle' || b.trip_type == 'walk') {
          return 1999;
        } else {
          return 2000;
        }
      }
      return a.cost - b.cost;
    })
  }

  orderByEndTime()
  {
    let h = this.helpers;
    return this.itineraries.sort(function (a : ItineraryModel, b : ItineraryModel) {
      //sorts by earliest arrival time
      return h.compareTimes(a.legs[a.legs.length-1].endTime, b.legs[b.legs.length-1].endTime);
    })
  }

  orderByWaitTime()
  {
    let h = this.helpers;
    return this.itineraries.sort(function (a : ItineraryModel, b : ItineraryModel) {
      //sorts by earliest arrival time
      return h.compareTimes(a.wait_time, b.wait_time);
    })
  }

  updateDate(date: string) {
    this.departureDate = new Date(date);
  }

  updateTime(time: string) {
    this.departureTime = new Date(time);
  }

  updateTransportationOptionsButton() {
    this.can_plan_trips = true;
  }

  purposeList(itin: ItineraryModel): string {
    return itin.service.purposes.map((purp) => purp.name).join(', ');
  }

  // Loads the page from a OneClick trip response
  loadTripResponse(tripResponse: TripResponseModel) {
    this.tripResponse = new TripResponseModel(tripResponse);
    this.trip_id = this.tripResponse.id;
    this.updateTravelTimesFromTripResponse(this.tripResponse);
    this.updateTripPlaces(this.tripResponse);

    this.itineraries = this.tripResponse.itineraries.map(function(itin) {
      if (itin.legs) {
        itin.legs = itin.legs.map(function(legAttrs) {
          return new LegModel().assignAttributes(legAttrs);
        });
      }
      return itin;
    });
    this.orderBy = "trip_type";
    this.orderItinList();

    this.changeDetector.markForCheck(); // using markForCheck instead of detectChanges fixes view destroyed error
    this.loader.hideLoader();
  }

  // Plans a trip based on origin and destination
  findTransportation(origin: GooglePlaceModel,
                     destination: GooglePlaceModel) {

    if (!origin || !destination) {
      if (!origin) this.originInvalid = true;
      if (!destination) this.destinationInvalid = true;
      this.alertController.create({
        header: this.translate.instant("oneclick.global.missing_fields"),
        message: this.translate.instant("oneclick.pages.user_locator.origin_destination_search.required"),
        buttons: [this.translate.instant("oneclick.global.ok")],
      }).then(alert => alert.present());
    }
    else {
      this.originInvalid = false;
      this.destinationInvalid = false;
      let combinedDateTime: Date = new Date(this.departureDateTime);
      if (this.departureDate) {
        combinedDateTime = new Date(this.departureDate);
      }
      if (this.departureTime) {
        combinedDateTime.setHours(this.departureTime.getHours());
        combinedDateTime.setMinutes(this.departureTime.getMinutes());
      }

      this.can_plan_trips = false;

      this.origin = new GooglePlaceModel(origin);
      this.destination = new GooglePlaceModel(destination);

      // Set origin and destination
      this.tripRequest.trip.origin_attributes = this.origin.toOneClickPlace();
      this.tripRequest.trip.destination_attributes = this.destination.toOneClickPlace();

      // Set trip time to now by default, in ISO 8601 format
      if (this.departureDateTime == undefined) {
        this.tripRequest.trip.trip_time = new Date().toISOString();
      } else {
        this.tripRequest.trip.trip_time = this.helpers.dateISOStringWithTimeZoneOffset(combinedDateTime);
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
  }

  viewParatransitOptions(itinerary: ItineraryModel) {
    let tripResponse = this.tripResponse;
    this.router.navigate([ParatransitServicesPage.routePath, tripResponse.id], {
      state: {
        trip_response: tripResponse,
        itinerary: itinerary
      }
    });
  }

  openDirectionsPageForItinerary(itinerary: ItineraryModel) {
    let tripResponse = this.tripResponse;

    this.router.navigate([DirectionsPage.routePath, tripResponse.id], {
      state: {
        trip_response: tripResponse,
        itinerary: itinerary
      }
    });
  }

  openOtherTransportationOptions(){
    // Plan a trip and store the result.
    // Once response comes in, update the UI with travel times and allow
    // user to select a mode to view directions.

    this.buildTripRequest(this.allModes);
    this.router.navigate([TransportationEligibilityPage.routePath, this.trip_id], {
      state: {
        trip_request: this.tripRequest,
        origin: this.origin,
        destination: this.destination
      }
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

  getDepartAtTime(itin: ItineraryModel): string {
    let h = this.helpers; // for date manipulation methods

    // TRIP TIMES
    // Trip's trip_time in milliseconds since epoch
    let tripTimeInMS: any = Date.parse(this.tripRequest.trip.trip_time);
    let tripDepartAtTime: any

    // Round to nearest 15 min (up and down) and format as ISO string with TZ offset
    if (this.tripRequest.trip.arrive_by) {
      tripDepartAtTime = h.dateISOStringWithTimeZoneOffset(new Date((tripTimeInMS - itin.duration*1000)));
    } else {
      tripDepartAtTime = h.dateISOStringWithTimeZoneOffset(new Date(tripTimeInMS));
    }

    return tripDepartAtTime;
  }

  getArriveByTime(itin: ItineraryModel): string {
    let h = this.helpers; // for date manipulation methods

    // TRIP TIMES
    // Trip's trip_time in milliseconds since epoch
    let tripTimeInMS: any = Date.parse(this.tripRequest.trip.trip_time);
    let tripArriveByTime: any

    // Round to nearest 15 min (up and down) and format as ISO string with TZ offset
    if (this.tripRequest.trip.arrive_by) {
      tripArriveByTime = h.dateISOStringWithTimeZoneOffset(new Date(tripTimeInMS));
    } else {
      tripArriveByTime = h.dateISOStringWithTimeZoneOffset(new Date((tripTimeInMS + itin.duration*1000)));
    }

    return tripArriveByTime;
  }


}
