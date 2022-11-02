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

@Component({
  selector: 'app-user-locator',
  templateUrl: './user-locator.page.html',
  styleUrls: ['./user-locator.page.scss'],
})
export class UserLocatorPage implements OnInit {
  static routePath:string = '/locator';

  @ViewChild('originSearch') originSearch: PlaceSearchComponent;
  @ViewChild('destinationSearch') destinationSearch: PlaceSearchComponent;

  @ViewChild('originResults') originResults: AutocompleteResultsComponent;
  @ViewChild('destinationResults') destinationResults: AutocompleteResultsComponent;

  map: google.maps.Map;
  userLocation: GooglePlaceModel;
  viewType: string; // Flag for showing the find svcs view vs. the direct transportation finder view. Can be set to 'services' or 'transportation'
  originMarker: google.maps.Marker;
  destinationMarker: google.maps.Marker;
  imageForDestinationMarker: string;
  selectedOriginItem: number = null;
  lastClicked: string; // used for the map clicking logic
  //myLatLng: google.maps.LatLng = null;
  arriveBy: boolean;
  departureDateTime: string;
  departureDate: Date;
  departureTime: Date;

  originInvalid: boolean = true;
  destinationInvalid: boolean = true;

  constructor(public router: Router,
              private route: ActivatedRoute,
              public platform: Platform,
              public geoServiceProvider: GeocodeService,
              private googleMapsHelpers: GoogleMapsHelpersService,
              private helpers: HelpersService,
              private changeDetector: ChangeDetectorRef,
              private auth: AuthService,
              private translate: TranslateService,
              public toastCtrl: ToastController,
              public alertController: AlertController
            ) {

    this.map = null;
    this.lastClicked = null;
    this.userLocation = null; // The user's device location\

    this.arriveBy = false;
    this.departureDateTime = this.helpers.dateISOStringWithTimeZoneOffset(new Date());
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.viewType = params.get('viewType');// Find services vs. transportation view
    })
  }

  ionViewDidEnter() {
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
      this.googleMapsHelpers.dropUserLocationPin(this.map, this.originMarker.getPosition());
      this.googleMapsHelpers.dropUserLocationPin(this.map, this.destinationMarker.getPosition());
      this.setMapCenter();
    }

    // Check if we're on a mobile device (as opposed to browser) or a non-Windows browser.
    // Geolocation features are only enabled for those platforms.
    // (The Windows check doesn't actually work, but leaving in for now.)
    //if (this.platform.is('cordova') || !this.platform.is('windows')) {
    //  this.checkGeolocationSupportAndSetupFeatures();
    //} else {
      this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found");
    //}
  }

  placeSearchChanged() {
    this.changeDetector.markForCheck();
  }

  checkGeolocationSupportAndSetupFeatures() {
    // Check if the Permissions API is supported.
    // (The Permissions API is not supported on IE11, so this check isn't that useful.)
    //if (navigator['permissions']) {

      // Check if device has permission to geolocate.
      //navigator['permissions'].query({
      //  name: 'geolocation'
      //}).then(permission => {
      //  if (permission.state === "granted") {

            // Check if the Geolocation API is supported
            Geolocation.checkPermissions()
            .then(
              () => this.setupGeolocationFeatures()
            )
            .catch(
              () => {
                console.error("The browser or device does not support geolocation.");
                this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found");
              }
            );
            
      //  } else if (permission.state === "prompt") {
      //    console.log("The browser or device needs to prompt the user for geolocation permission. Won't geolocate initially.");
      //    this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found");
      //  } else {
      //    console.error("The browser or device does not have permission for geolocation.");
      //    this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found");
      //  }
      //});
    //} else {
    //  console.error("The browser or device does not support checking permissions for geolocation.");
    //  this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found");
    //}
  }

  setupGeolocationFeatures() {
    // Add a location geolocator button that centers the map and sets the from place
    this.googleMapsHelpers
    .addYourLocationButton(this.map, (latLng) => {
      this.zoomToOriginLocation(latLng);

      // Clear the search bar and search results
      this.originSearch.query = "";

      // Clear the origin search location so it acan be replaced by the user location
      this.originSearch.place = null;

    });

    // Try to automatically geolocate, centering the map and setting the from place
    // Timeout if the geolocation takes too long.
    var options = {
      timeout: 5000,
    };

    Geolocation.getCurrentPosition(options).then(
      (position) => {
        // Only zoom to location if another location isn't set yet
        if(!this.userLocation) {
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.zoomToOriginLocation(latLng);
          this.setUserPlaceFromLatLng(latLng);
        }
      }
    ).catch(
      (err) => {
        console.error("Could not geolocate device position");
        this.originSearch.placeholder = this.translate.instant("oneclick.pages.user_locator.origin_search.placeholder_found");
      }
    );
  }

  // Updates the userLocation, and centers the map at the given latlng
  zoomToOriginLocation(latLng: google.maps.LatLng) {
    if (this.originMarker != undefined && this.originMarker.getMap() != null) {
      this.originMarker.setMap(null);
    }

    this.originMarker = this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
    this.originMarker.setLabel('A');
    this.setMapCenter();
  }

  zoomToDestinationLocation(latLng: google.maps.LatLng) {
    if (this.destinationMarker != undefined && this.destinationMarker.getMap() != null) {
      this.destinationMarker.setMap(null);
    }

    this.destinationMarker = this.googleMapsHelpers.dropUserLocationPin(this.map, latLng);
    this.destinationMarker.setIcon(this.imageForDestinationMarker);
    this.destinationMarker.setLabel('B');
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

  updateDate(date: string) {
    this.departureDate = new Date(date);
  }

  updateTime(time: string) {
    this.departureTime = new Date(time);
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

      this.router.navigate([TripResponsePage.routePath], {
        state: {
          origin: origin,
          destination: destination,
          departureDateTime: this.helpers.dateISOStringWithTimeZoneOffset(combinedDateTime),
          arriveBy: this.arriveBy 
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
