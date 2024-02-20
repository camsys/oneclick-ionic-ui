import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteResultsComponent } from 'src/app/components/autocomplete-results/autocomplete-results.component';
import { PlaceSearchComponent } from 'src/app/components/place-search/place-search.component';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { ItineraryModel } from 'src/app/models/itinerary';
import { LegModel } from 'src/app/models/leg';
import { OneClickPlaceModel } from 'src/app/models/one-click-place';
import { ServiceModel } from 'src/app/models/service';
import { Session } from 'src/app/models/session';
import { TripRequestModel } from 'src/app/models/trip-request';
import { TripResponseModel } from 'src/app/models/trip-response';
import { ExternalNavigationService } from 'src/app/services/external-navigation.service';
import { LoaderService } from 'src/app/services/loader.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { appConfig } from 'src/environments/appConfig';
import { EmailModalPage } from '../../email-modal/email-modal.page';
import { HelpMeFindPage } from '../../help-me-find/help-me-find.page';
import { TripResponsePage } from '../../trip-response/trip-response.page';

@Component({
  selector: 'app-service-for211-detail',
  templateUrl: './service-for211-detail.page.html',
  styleUrls: ['./service-for211-detail.page.scss'],
})
export class ServiceFor211DetailPage implements OnInit {
  static routePath:string = '/service_detail';


  service: ServiceModel = {} as ServiceModel;
  origin: GooglePlaceModel = new GooglePlaceModel({});
  destination: GooglePlaceModel = new GooglePlaceModel({});
  basicModes:string[] = ['transit', 'car', 'taxi', 'lyft', 'bicycle'] // All available modes except paratransit
  allModes:string[] = ['transit', 'car', 'taxi', 'lyft', 'bicycle', 'paratransit'] // All modes
  returnedModes:string[] = [] // All the basic modes returned from the plan call
  tripRequest: TripRequestModel;
  tripResponse: TripResponseModel = new TripResponseModel({});
  //tripPlanSubscription: any;
  detailKeys: string[] = []; // Array of the non-null detail keys in the details hash
  arriveBy: boolean;

  itineraries: ItineraryModel[];

  trip_id: number;
  service_id: string;
  location_id: string;
  service_location: OneClickPlaceModel;

  transitTime: number = 0;
  driveTime: number = 0;
  bicycleTime: number = 0;

  departureDateTime: string;

  showTransportationFinder: boolean;

  constructor(public navCtrl: NavController,
              public route: ActivatedRoute,
              public router: Router,
              public oneClick: OneClickService,
              public changeDetector: ChangeDetectorRef,
              //public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private translate: TranslateService,
              private loader: LoaderService,
              public exNav: ExternalNavigationService) {

                this.showTransportationFinder = appConfig.INCLUDE_TRANSPORTATION_FINDER;
  }
  
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.service_id = params.get('service_id'); 
      this.location_id = params.get('location_id');

      if (this.router.getCurrentNavigation().extras.state) {
        let state = this.router.getCurrentNavigation().extras.state;

        this.trip_id = +state.trip_id;
        this.arriveBy = state.arrive_by;
        this.service = state.service;
        this.origin = state.origin;
        this.destination = state.destination;
        this.departureDateTime = state.departureDateTime;
      }

    });
  }

  /**
   * On View Enter:
   * 1. if service id is passed in fetch it and on response:
   *   a. load service details into page state
   *   b. overwrite destination data in page state(this probably means there's redundant code somewhere)
   *   c. update originSearch and destinationSearch
   * 2. if a trip id is passed in, then fetch trip details and load it in
   * 3. else if an origin and destination is supplied
   *   a. load that into the page state
   *   b. set departure time from navParams
   * 4. else if none of the above is present, redirect home
   */
  ionViewDidEnter() {
    // Show the spinner until a trip is present
    // this.events.publish('spinner:show');

    // If a service_id and location_id are passed, get its details and load it into the page
    if(this.service_id && this.location_id) {
      this.oneClick
        .get211ServiceDetails(this.service_id, this.location_id)
        .subscribe((svc) => {
          this.loadServiceDetails(svc)
        });

      // If a service is passed in the navParams, load it onto the page
    } else if (this.service) {
      this.loadServiceDetails(this.service);
    }

    // NOTE: This might be dead code, warrants investigation into OCNUI, OCC, and OTP
    // If a Trip ID is present, use that to fetch the already-planned trip
    // if(this.trip_id) {
    //   this.oneClick.getTrip(this.trip_id)
    //     .subscribe((tripResponse) => this.loadTripResponse(tripResponse))

    //   // If an origin and destination are passed, make a trip request based on those
    // } else if( this.navParams.data.origin && (this.navParams.data.destination|| this.service) ) {
     if (this.origin && (this.destination || this.service) ) {
      
      
      // NOTE: this is probably redundant if we're fetching service details from OCC and loading it in anyways
      if (!this.destination && this.service) {
        this.destination = new GooglePlaceModel({
          address_components: this.service.address_components,
          geometry: {location: {lat: this.service.lat, lng: this.service.lng}},
          formatted_address: null,
          id: null,
          name: null
        });
      }

      // NOTE: Seems like dead code, trip data isn't actively used in the Find Service - Service Details Page
      // Plan a trip and store the result.
      // Once response comes in, update the UI with travel times and allow
      // user to select a mode to view directions.
      // this.tripPlanSubscription = this.oneClick // Store the subscription in a property so it can be unsubscribed from if necessary
      //   .planTrip(this.buildTripRequest(this.allModes))
      //   .subscribe((tripResponse) => {
      //     this.loadTripResponse(tripResponse);
      //   });

      // Otherwise, go to home page
    } else {
      this.navCtrl.navigateRoot('/');
    }

  }

  // On page leave, unsubscribe from the trip plan call so it doesn't trigger errors when it resolves
  ionViewWillLeave() {
    // if(this.tripPlanSubscription) {
    //   this.tripPlanSubscription.unsubscribe();
    // }
  }

  // placeSearchChanged() {
  //   this.changeDetector.markForCheck();
  // }

  // Populates the URL based on the trip and service ids
  // updateURL() {

  //   this.trip_id = this.tripResponse && this.tripResponse.id;

  //   if (this.service) {
  //     this.service_id = this.service.service_id;
  //     this.location_id = this.service.location_id;
  //   }

  //   let path = "/service_detail/";

  //   // If service is also present, add it as well.
  //   if(this.service_id && this.location_id) {
  //     path += this.service_id + "/" + this.location_id;
  //   }

  //   // Update the URL with the path string.
  //   //this.location.replaceState(path);
  //   // DEREK removed this because it was causing the back button to disappear.

  // }

  // Loads the page from a OneClick trip response
  // loadTripResponse(tripResponse: TripResponseModel) {
  //   this.tripResponse = new TripResponseModel(tripResponse);
  //   this.updateTravelTimesFromTripResponse(this.tripResponse);
  //   this.updateReturnedModes(this.tripResponse);
  //   this.updateTripPlaces(this.tripResponse);

  //   this.itineraries = this.tripResponse.itineraries.map(function(itin) {
  //     if (itin.legs) {
  //       itin.legs = itin.legs.map(function(legAttrs) {
  //         return new LegModel().assignAttributes(legAttrs);
  //       });
  //     }
  //     return itin;
  //   });

  //   this.updateURL();
  //   this.changeDetector.markForCheck(); // using markForCheck instead of detectChanges fixes view destroyed error
  //   this.loader.hideLoader();
  // }

  // Loads the page's service details based on a service object
  loadServiceDetails(service: ServiceModel) {

    // Set the service (if present)
    this.service = service as ServiceModel;

    if (this.service) {
      // Set the detail keys to the non-null details
      this.detailKeys = Object.keys(this.service.details)
                              .filter((k) => this.service.details[k] !== null);
      // Update destination address components with the Refernet returned service's address components
      this.destination.setAddressComponents(service.address_components);

      //this.updateOriginDestinationSearch()
    }

    // Update the URL now that the service ID is present (10/12/22 doesn't seem to actually do anything so remove)
    //this.updateURL();
    this.changeDetector.markForCheck();
  }

  // Plans a trip based on origin and destination
  findTransportation(origin: GooglePlaceModel,
                     destination: GooglePlaceModel, time: string) {

    this.router.navigate([TripResponsePage.routePath], {
      state: {
        origin: origin,
        destination: destination,
        tripRequest: this.tripRequest
      }
    });
  }

  // openOtherTransportationOptions(){
  //   this.navCtrl.push(TransportationEligibilityPage, {
  //     trip_request: this.tripRequest,
  //     trip_id: this.trip_id,
  //     origin: this.origin,
  //     destination: this.destination
  //   });
  // }

  // Builds a trip request based on the passed mode, stored origin/destination,
  // and current time
  // buildTripRequest(modes: string[]) {
  //   let tripRequest = this.tripRequest = new TripRequestModel();

  //   // Set origin and destination
  //   tripRequest.trip.origin_attributes = this.origin.toOneClickPlace();
  //   tripRequest.trip.destination_attributes = this.destination.toOneClickPlace();

  //   // Set trip time to now by default, in ISO 8601 format
  //   if (this.departureDateTime == undefined) {
  //     tripRequest.trip.trip_time = new Date().toISOString();
  //   } else {
  //     tripRequest.trip.trip_time = this.departureDateTime;
  //   }

  //   // Set arrive_by to true by default
  //   tripRequest.trip.arrive_by = this.arriveBy;

  //   // Set trip types to the mode passed to this method
  //   tripRequest.trip_types = modes;

  //   // Don't filter by schedule, because we aren't letting the user pick a time for paratransit or taxi
  //   // Also don't filter by eligibility, as doing so may exclude relevant results from the fare preview
  //   this.tripRequest.except_filters = ["schedule", "eligibility"];

  //   return tripRequest;
  // }

  // Updates transit and drive time based on a trip response
  // updateTravelTimesFromTripResponse(tripResponse: TripResponseModel) {
  //   let transitItin = tripResponse.itinerariesByTripType('transit')[0];
  //   if(transitItin && transitItin.duration) {
  //     this.transitTime = transitItin.duration;
  //   }

  //   let driveItin = tripResponse.itinerariesByTripType('car')[0];
  //   if(driveItin && driveItin.duration) {
  //     this.driveTime = driveItin.duration;
  //   }

  //   let bicycleItin = tripResponse.itinerariesByTripType('bicycle')[0];
  //   if(bicycleItin && bicycleItin.duration) {
  //     this.bicycleTime = bicycleItin.duration;
  //   }
  // }

  // Updates the returned modes list with the modes returned from the given response
  // updateReturnedModes(tripResponse: TripResponseModel) {
  //   this.returnedModes = this.basicModes.filter((mode) => {
  //     return tripResponse.includesTripType(mode);
  //   })
  // }

  // Updates the origin and destination based on the trip response
  // updateTripPlaces(tripResponse: TripResponseModel) {
  //   this.originSearch.setPlace(this.origin);
  //   this.destinationSearch.setPlace(this.destination);
  // }

  // updateOriginDestinationSearch() {
  //   this.originSearch.setPlace(this.origin);
  //   this.destinationSearch.setPlace(this.destination);
  // }

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

  // rateService(service: ServiceModel) {
  //   FeedbackModalPage.createModal(this.modalCtrl,
  //                                 this.toastCtrl,
  //                                 this.translate,
  //                               { subject: service, type: "OneclickRefernet::Service" })
  //                    .present();
  // }

  openEmailModal(service: ServiceModel) {
    this.modalCtrl.create({
      component: EmailModalPage,
      componentProps: { 
        service: service 
      }
    }).then(emailModel => emailModel.present());
  }

  // openSmsModal(service: ServiceModel) {
  //   let smsModal = this.modalCtrl.create(SmsModalPage, {service: service});
  //   smsModal.present();
  // }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }


}
