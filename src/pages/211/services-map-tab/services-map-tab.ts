import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsHelpersProvider } from '../../../providers/google/google-maps-helpers';
import { ServiceModel } from '../../../models/service';
import { Session } from '../../../models/session';
import { GooglePlaceModel } from "../../../models/google-place";
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail';

/**
 * Generated class for the ServicesMapTabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services-map-tab',
  templateUrl: 'services-map-tab.html',
})
export class ServicesMapTabPage {

  // This is needed to dynamically change the div containing the marker's information
  service_map: google.maps.Map;
  services: ServiceModel[];
  selectedService: ServiceModel;
  markerSelected: boolean;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public geolocation: Geolocation,
              private googleMapsHelpers: GoogleMapsHelpersProvider,
              public events: Events,
              private changeDetector: ChangeDetectorRef) {
    this.service_map = null;
    this.services = navParams.data;
    this.selectedService = null;
    this.markerSelected = false;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => { this.initializeMap();});
  }

  initializeMap(): void {
    this.service_map = this.googleMapsHelpers.buildGoogleMap('service-results-map-canvas');

    this.googleMapsHelpers.addParticipatingCountiesLayer(this.service_map);

    let me = this;

    // Draw service markers, with event handlers that open details window on click
    let markers = this.services
        .filter((service) => {
          return (typeof service.lat!='undefined' && service.lat) &&
                 (typeof service.lng!='undefined' && service.lng);
        })
        .map((service) => {
          let service_location : google.maps.LatLng = new google.maps.LatLng(Number(service.lat), Number(service.lng));

          let marker : google.maps.Marker = new google.maps.Marker;
          marker.setPosition(service_location);
          marker.setMap(this.service_map);
          marker.setValues(service);
          marker.setTitle(service.agency_name);
          marker.setClickable(true);
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
          marker.addListener('click', function() {
            me.addServiceInfo(service);
          });
          return marker;
        });

    // add in 'you are here' marker
    let yourLocation = this.session().user_starting_location;
    let your_location_service_location : google.maps.LatLng = new google.maps.LatLng(Number(yourLocation.geometry.location.lat), Number(yourLocation.geometry.location.lng));

    let your_location_marker : google.maps.Marker = new google.maps.Marker;
    your_location_marker.setPosition(your_location_service_location);
    your_location_marker.setMap(this.service_map);
    your_location_marker.setTitle('You are here');
    your_location_marker.setClickable(false);
    markers.push(your_location_marker);

    // Zoom the map to fit all the services
    this.googleMapsHelpers.zoomToObjects(this.service_map, markers);

    // Add event handler for clicking OFF a service marker, closing the details window
    google.maps.event.addListener(this.service_map, "click", function(event) {
      me.markerSelected = false;
      me.selectedService = null;
    });

  }

  addServiceInfo(svc: ServiceModel){
    this.markerSelected = true;
    this.selectedService = svc;
    this.changeDetector.markForCheck();
  }

  selectService(match : ServiceModel){
    let startLocation = this.session().user_starting_location;

    let destination_location = new GooglePlaceModel({
      address_components: null,
      geometry: {location: {lat: match.lat, lng: match.lng}},
      formatted_address: null,
      id: null,
      name: null
    });
    let departureDateTime = this.session().user_departure_datetime;
    let arriveBy = this.session().user_arrive_by;

    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage, {service_id: match.service_id, location_id: match.location_id, origin: startLocation, destination: destination_location, departureDateTime: departureDateTime, arriveBy: arriveBy});
  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }
}
