import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ItineraryModel } from 'src/app/models/itinerary';
import { TripResponseModel } from 'src/app/models/trip-response';
import { GeocodeService } from 'src/app/services/google/geocode.service';
import { GoogleMapsHelpersService } from 'src/app/services/google/google-maps-helpers.service';

@Component({
  selector: 'app-directions-map-tab',
  templateUrl: './directions-map-tab.page.html',
  styleUrls: ['./directions-map-tab.page.scss'],
})
export class DirectionsMapTabPage implements OnInit {

  trip:TripResponseModel;
  mode:string;
  itineraries: ItineraryModel[];
  itinerary: ItineraryModel;
  selectedItinerary: string;
  map: google.maps.Map;
  routeLines: google.maps.Polyline[][];
  startMarker: google.maps.Marker;
  endMarker: google.maps.Marker;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public geoServiceProvider: GeocodeService,
              private googleMapsHelpers: GoogleMapsHelpersService,
              public changeDetector: ChangeDetectorRef) {
    this.trip = navParams.data.trip;
    //this.mode = navParams.data.mode;

    if (navParams.data.itinerary) {
      this.itinerary = navParams.data.itinerary;
      this.itineraries = this.trip.itineraries.slice(0).filter((itin) => itin === this.itinerary);
    } else {
      this.itineraries = this.trip.itineraries;
    }

    this.selectedItinerary = "0";
    this.routeLines = [];
  }

  ngOnInit() {
    this.initializeMap();
  }

  // Sets up the google map
  initializeMap() {

    this.map = this.googleMapsHelpers.buildGoogleMap('directions-route-map-canvas');

    this.googleMapsHelpers.addParticipatingCountiesLayer(this.map);

    let me = this;

    // Create and store google maps polyLines for each itinerary's legs
    this.routeLines = this.itineraries.map(function(itin) {

      let legLines = itin.legs.map(function(leg) {

        let routePoints = google.maps.geometry.encoding
                          .decodePath(leg.legGeometry.points); // Convert the itinerary's leg geometry into an array of google latlngs
        let routeLine = me.googleMapsHelpers.drawRouteLine(routePoints, leg.mode); // Build the route line object

        return routeLine;
      })

      return legLines;

    });

    this.drawSelectedRoute();

    // TODO: Get start and end icons to look good
    // Set the start and end markers
    let startIcon = {
      url: 'assets/img/origin_icon.png',
      scaledSize: new google.maps.Size(20,20),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(10,10)
    }

    this.startMarker = new google.maps.Marker({
      // icon: startIcon,
      label: 'A',
      position: { lat: parseFloat(this.trip.origin.lat.toString()), lng: parseFloat(this.trip.origin.lng.toString()) },
      map: this.map
    });

    let endIcon = {
      url: 'assets/img/destination_icon.png',
      scaledSize: new google.maps.Size(20,20),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(10,10)
    }

    this.endMarker = new google.maps.Marker({
      // icon: endIcon,
      label: 'B',
      position: { lat: parseFloat(this.trip.destination.lat.toString()), lng: parseFloat(this.trip.destination.lng.toString()) },
      map: this.map
    });

  }

  drawSelectedRoute() {

    // Remove all routeLines from the map
    this.routeLines.forEach((rls) => rls.forEach((rl) => rl.setMap(null)));

    // Draw the selected route lines on the map
    let selectedRouteLines = this.routeLines[parseInt(this.selectedItinerary)];
    selectedRouteLines.forEach((rl) => rl.setMap(this.map));

    // Zoom the map extent to the route line
    this.googleMapsHelpers.zoomToObjects(this.map, selectedRouteLines);

  }


}
