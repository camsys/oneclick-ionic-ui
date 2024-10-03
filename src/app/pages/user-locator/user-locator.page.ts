import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteResultsComponent } from 'src/app/components/autocomplete-results/autocomplete-results.component';
import { PlaceSearchComponent } from 'src/app/components/place-search/place-search.component';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { AuthService } from 'src/app/services/auth.service';
import { GeocodeService } from 'src/app/services/google/geocode.service';
import { GoogleMapsHelpersService } from 'src/app/services/google/google-maps-helpers.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { CategoriesFor211Page } from '../211/categories-for211/categories-for211.page';
import { TripResponsePage } from '../trip-response/trip-response.page';
import { OneClickService } from 'src/app/services/one-click.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy, } from '@angular/core';
import { appConfig } from 'src/environments/appConfig';

@Component({
  selector: 'app-user-locator',
  templateUrl: './user-locator.page.html',
  styleUrls: ['./user-locator.page.scss'],
})
export class UserLocatorPage implements OnInit, OnDestroy {
  static routePath:string = '/locator';

  @ViewChild('originSearch') originSearch: PlaceSearchComponent;
  @ViewChild('destinationSearch') destinationSearch: PlaceSearchComponent;

  @ViewChild('originResults') originResults: AutocompleteResultsComponent;
  @ViewChild('destinationResults') destinationResults: AutocompleteResultsComponent;

  tripPurposeFilterOn: boolean = false;

  map: google.maps.Map;
  userLocation: GooglePlaceModel;
  viewType: string; // Flag for showing the find svcs view vs. the direct transportation finder view. Can be set to 'services' or 'transportation'
  originMarker: google.maps.Marker;
  destinationMarker: google.maps.Marker;
  selectedOriginItem: number = null;
  lastClicked: string; // used for the map clicking logic
  //myLatLng: google.maps.LatLng = null;
  arriveBy: boolean;
  departureDateTime: string;
  departureDate: Date;
  departureTime: Date;
  tripPurposes: any[] = [];
  selectedTripPurposeId: string;

  originInvalid: boolean = true;
  destinationInvalid: boolean = true;

  showToolbar:boolean = true;

  private unsubscribe: Subject<void> = new Subject(); 

  constructor(public router: Router,
              private route: ActivatedRoute,
              public platform: Platform,
              public geoServiceProvider: GeocodeService,
              private googleMapsHelpers: GoogleMapsHelpersService,
              private helpers: HelpersService,
              private changeDetector: ChangeDetectorRef,
              private auth: AuthService,
              public translate: TranslateService,
              public toastCtrl: ToastController,
              public alertController: AlertController,
              private oneClickService: OneClickService
            ) {

    this.tripPurposeFilterOn = appConfig.INCLUDE_TRIP_PURPOSE_FILTER;
    this.map = null;
    this.lastClicked = null;
    this.userLocation = null; // The user's device location\

    this.arriveBy = false;
    let today = new Date();
    this.departureDateTime = this.helpers.dateISOStringWithTimeZoneOffset(today);
    this.departureDate = today;
    this.departureTime = today;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.viewType = params.get('viewType');// Find services vs. transportation view
    })
    this.loadTripPurposes();

    // Properly handle language changes
    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      // Reload trip purposes when language changes
      this.loadTripPurposes();
    });
  }

  ngOnDestroy() {
    // Call next and complete on unsubscribe to clean up subscriptions
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  

  loadTripPurposes() {
    if (this.tripPurposeFilterOn) {
      this.oneClickService.getTripPurposes().subscribe(
        purposes => {
          this.tripPurposes = purposes;
        },
        error => console.error('Error fetching trip purposes:', error)
      );
    }
  }
  
  tripPurposeChanged(e) {
    this.selectedTripPurposeId = e.detail.value;
    console.log('Trip purpose is:', this.selectedTripPurposeId);
  }
  

  ionViewDidEnter() {
    this.showToolbar = true;//make sure this visible whenever user enters page
    
    // Initialize the map once device is ready
    this.platform.ready()
    .then(() => this.initializeMap());
  }

  arriveBySelectChanged(e) {
    this.arriveBy = e.detail.value;
  }

  // Sets up the google map and geolocation services
  initializeMap() {
    this.map = this.googleMapsHelpers.buildGoogleMap('user-locator-map-canvas');

    this.googleMapsHelpers.addParticipatingCountiesLayer(this.map);

    this.setMapClickListener();

    if ((this.originMarker) && (this.destinationMarker)) {
      this.setOriginMarker(this.originMarker.getPosition());
      this.setDestinationMarker(this.destinationMarker.getPosition());
      this.setMapCenter();
    }
  }

  setOriginMarker(latLng: google.maps.LatLng) {
    this.originMarker = this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
    this.originMarker.setLabel('A');
  }

  setDestinationMarker(latLng: google.maps.LatLng) {
    this.destinationMarker = this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
    this.destinationMarker.setLabel('B');
  }

  placeSearchChanged() {
    this.changeDetector.markForCheck();
  }

  

  // Updates the userLocation, and centers the map at the given latlng
  zoomToOriginLocation(latLng: google.maps.LatLng) {
    if (this.originMarker != undefined && this.originMarker.getMap() != null) {
      this.originMarker.setMap(null);
    }

    this.setOriginMarker(latLng);
    this.setMapCenter();
  }

  zoomToDestinationLocation(latLng: google.maps.LatLng) {
    if (this.destinationMarker != undefined && this.destinationMarker.getMap() != null) {
      this.destinationMarker.setMap(null);
    }

    this.setDestinationMarker(latLng);
    this.setMapCenter();
  }

  // Sets map center to origin and/or destination points
  setMapCenter() {
    let pts: google.maps.LatLng[] = [];

    if(this.originMarker) {
      pts.push(this.originMarker.getPosition());
    }

    if(this.destinationMarker) {
      pts.push(this.destinationMarker.getPosition());
    }

    this.googleMapsHelpers.zoomToPoints(this.map, pts);
  }

  // Goes on to the categories/services page, using the given location as the center point
  searchForServices(place: GooglePlaceModel){
    if (!place) {
      this.originInvalid = true;
      this.alertController.create({
        header: this.translate.instant("oneclick.global.missing_fields"),
        message: this.translate.instant("oneclick.pages.user_locator.origin_search.required"),
        buttons: [this.translate.instant("oneclick.global.ok")],
      }).then(alert => alert.present());
    }
    else {
      this.originInvalid = false;
      this.storePlaceInSession(place);
      this.storeDepartureDateTime(this.helpers.dateISOStringWithTimeZoneOffset(new Date()));
      this.storeArriveBy(this.arriveBy);
      this.router.navigate([CategoriesFor211Page.routePath]);
    }
  }

  hideShowToolbar() {
    this.showToolbar = !this.showToolbar;
  }

  updateDate(date: string) {
    if (!date) this.departureDate = null;
    else this.departureDate = new Date(date);
  }

  updateTime(time: string) {
    if (!time) this.departureTime = null;
    else this.departureTime = new Date(time);
  }

  swapOriginDestination() {
    //for now, require values for origin and destination
    let originPlace = this.originSearch.place;
    let destinationPlace = this.destinationSearch.place;
    if (originPlace && destinationPlace) {
      this.originSearch.setPlace(destinationPlace);
      this.destinationSearch.setPlace(originPlace);
    }
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
    else if (!this.departureDate) {
      this.alertController.create({
        header: this.translate.instant("oneclick.global.invalid_date"),
        message: this.translate.instant("oneclick.pages.user_locator.invalid_date_message"),
        buttons: [this.translate.instant("oneclick.global.ok")],
      }).then(alert => alert.present());
    }
    else if (!this.departureTime) {
      this.alertController.create({
        header: this.translate.instant("oneclick.global.invalid_time"),
        message: this.translate.instant("oneclick.pages.user_locator.invalid_time_message"),
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

      this.router.navigate([TripResponsePage.routePath], {
        state: {
          origin: origin,
          destination: destination,
          departureDateTime: this.helpers.dateISOStringWithTimeZoneOffset(combinedDateTime),
          arriveBy: this.arriveBy,
          selectedTripPurposeId: this.selectedTripPurposeId
        }
      });
    }
  }

  // After device geolocation, update the userLocation property
  private setUserPlaceFromLatLng(latLng: google.maps.LatLng) : void{
    let lat = latLng.lat();
    let lng = latLng.lng();

    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => {
      this.userLocation = places[0];
      this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found") + this.userLocation.formatted_address;

      // Set the origin to the user location if it isn't already set
      //this.originSearch.place = this.originSearch.place || this.userLocation;
      if (this.originSearch.place == null) {
        this.originSearch.setPlace(this.userLocation);
      }
    });
  }

  // Centers map on a place
  centerMapOnPlace(place: GooglePlaceModel, originOrDestination: string) {
    place = new GooglePlaceModel(place);
    if(originOrDestination == 'origin') {
      this.zoomToOriginLocation(new google.maps.LatLng(place.lat(), place.lng()));
    } else if(originOrDestination == 'destination') {
      this.zoomToDestinationLocation(new google.maps.LatLng(place.lat(), place.lng()));
    }
  }

  // Store place in session hash
  private storePlaceInSession(place: GooglePlaceModel) {
    let session = this.auth.session();
    session.user_starting_location = place;
    this.auth.setSession(session);
  }

  private storeDepartureDateTime(time: string) {
    let session = this.auth.session();
    session.user_departure_datetime = time;
    this.auth.setSession(session);
  }

  private storeArriveBy(arriveBy: boolean) {
    let session = this.auth.session();
    session.user_arrive_by = arriveBy;
    this.auth.setSession(session);
  }


  ////////// Support Clicking the Map ///////////////////////////////////
  // Depending on some logic, assume this click is either setting the Origin or the Destination
  private setPlaceFromClick(latLng: google.maps.LatLng): void{
    if(this.viewType == 'services' || this.originSearch.place == null || this.lastClicked == 'destination')
      this.setOriginFromClick(latLng);
    else
      this.setDestinationFromClick(latLng);
  }

  // Update the Origin from a Map Click
  private setOriginFromClick(latLng: google.maps.LatLng) : void{
    let lat = latLng.lat();
    let lng = latLng.lng();

    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => {
      this.userLocation = places[0];
      this.originSearch.query = this.userLocation.formatted_address;
      this.zoomToOriginLocation(latLng);
      // Set the origin to the user location
      this.originSearch.place = this.userLocation;
      this.lastClicked = 'origin';
      this.checkIfZipcodeOutOfArea(places[0]);
    });
  }

  // Update the Destination from a Map Click
  private setDestinationFromClick(latLng: google.maps.LatLng) : void{
    let lat = latLng.lat();
    let lng = latLng.lng();

    this.geoServiceProvider.getPlaceFromLatLng(lat, lng)
    .subscribe( (places) => {
      //this.userLocation = places[0];
      this.destinationSearch.query = places[0].formatted_address;
      this.zoomToDestinationLocation(latLng);
      // Set the origin to the user location
      //this.destinationSearch.place = places[0];
      this.destinationSearch.setPlace(places[0]);
      this.lastClicked = 'destination';
      this.checkIfZipcodeOutOfArea(places[0]);
    });
  }

  // Check if the Google place's zipcode is within the service area of Find Services or Transportation workflow.
  private checkIfZipcodeOutOfArea(place: GooglePlaceModel) : void {
    if (this.viewType == 'services') {
        if (this.geoServiceProvider.isZipcodeOutOfAreaForServices(place)) {
          this.toastCtrl.create({
            message: this.translate.instant('find_services_out_of_area_message'),
            position: 'bottom',
            duration: 3000
          }).then(toast => toast.present());
        }
    } else {
      if (this.geoServiceProvider.isZipcodeOutOfAreaForTransportation(place)) {
          this.toastCtrl.create({
            message: this.translate.instant('find_transportation_out_of_area_message'),
            position: 'bottom',
            duration: 3000
          }).then(toast => toast.present());
      }
    }
  }

  // Detect the Click and Grab the LatLng
  private setMapClickListener(){
    let me = this;
    google.maps.event.addListener(this.map, 'click', function(event) {
      me.setPlaceFromClick(event.latLng);
    });
    // Also capture click events on the data layer overlay.
    google.maps.event.addListener(this.map.data, 'click', function(event) {
      me.setPlaceFromClick(event.latLng);
    });
  }
  //////////////////////////////////////////////////////////////////////


}
