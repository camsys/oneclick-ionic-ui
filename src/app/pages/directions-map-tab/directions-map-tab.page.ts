import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ItineraryModel } from 'src/app/models/itinerary';
import { TripResponseModel } from 'src/app/models/trip-response';
import { DirectionsParamsService } from 'src/app/services/directions-params.service';
import { GeocodeService } from 'src/app/services/google/geocode.service';
import { GoogleMapsHelpersService } from 'src/app/services/google/google-maps-helpers.service';

@Component({
  selector: 'app-directions-map-tab',
  templateUrl: './directions-map-tab.page.html',
  styleUrls: ['./directions-map-tab.page.scss'],
})
export class DirectionsMapTabPage implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();


  trip:TripResponseModel;
  mode:string;
  itineraries: ItineraryModel[];
  itinerary: ItineraryModel;
  selectedItinerary: string;
  map: google.maps.Map;
  routeLines: google.maps.Polyline[][];
  arc: google.maps.Marker;
  startMarker: google.maps.Marker;
  endMarker: google.maps.Marker;

  constructor(public geoServiceProvider: GeocodeService,
              private googleMapsHelpers: GoogleMapsHelpersService,
              private dirParamsService: DirectionsParamsService,
              public changeDetector: ChangeDetectorRef) {

    this.selectedItinerary = "0";
    this.routeLines = [];
  }

  ngOnInit() {
    this.dirParamsService.params$.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params: any) => {
        if (params) {
          this.trip = params.trip;
          this.itinerary = params.itinerary;

          if (this.itinerary) {
            this.itineraries = this.trip.itineraries.slice(0).filter((itin) => itin === this.itinerary);
          } else {
            this.itineraries = this.trip.itineraries;
          }
          
          this.initializeMap();
        }
      }
    );

  }

  //TODO: BECKY eventually there may be more than one arc (like for deviated fixed route) - will need to refactor this
  updateArcMarker(start: google.maps.LatLng, end: google.maps.LatLng): Function {
    return (): void  => {
      this.arc = this.googleMapsHelpers.createUpdateArc(
        this.arc,
        this.map, 
        start,
        end);
    }
  }

  // Sets up the google map
  initializeMap() {
    this.map = this.googleMapsHelpers.buildGoogleMap('directions-route-map-canvas');

    this.googleMapsHelpers.addParticipatingCountiesLayer(this.map);

    let me = this;


    //TODO: BECKY determining when to use the arc symbol will need to change
    if (this.itinerary && this.itinerary.trip_type == 'paratransit') {
      let start = new google.maps.LatLng(this.trip.origin.lat, this.trip.origin.lng);//for now this will be the start of the arc
      let end = new google.maps.LatLng(this.trip.destination.lat, this.trip.destination.lng);//for now this will be the end of the arc
      google.maps.event.addListener(this.map, 'projection_changed', this.updateArcMarker(start, end).bind(this));
      google.maps.event.addListener(this.map, 'zoom_changed', this.updateArcMarker(start, end).bind(this));
    }

    // Create and store google maps polyLines for each itinerary's legs
    this.routeLines = this.itineraries.map(function(itin) {

      let legLines;
      if (itin.legs) {//TODO: BECKY eventually there may be paratransit legs so this section won't apply to those
        legLines = itin.legs.map(function(leg) {

          let routePoints = google.maps.geometry.encoding
                            .decodePath(leg.legGeometry.points); // Convert the itinerary's leg geometry into an array of google latlngs
          let routeLine = me.googleMapsHelpers.drawRouteLine(routePoints, leg.mode); // Build the route line object

          return routeLine;
        })
      }

      return legLines;

    });

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

  ionViewDidEnter() {
    if (this.map) this.drawSelectedRoute();
  }

  drawSelectedRoute() {

    // Remove all routeLines from the map
    if (this.routeLines && this.routeLines[0]) this.routeLines.forEach((rls) => rls.forEach((rl) => rl.setMap(null)));
    //TODO: BECKY eventually there may be more than one arc so it will have to be more like the routeLines
    if (this.arc) this.arc.setMap(null);

    // Draw the selected route lines on the map
    let selectedRouteLines = [];
    if (this.routeLines && this.routeLines[0]) {
      selectedRouteLines = this.routeLines[parseInt(this.selectedItinerary)];
      selectedRouteLines.forEach((rl) => rl.setMap(this.map));
    }

    //TODO: BECKY eventually there may be more than one arc so it will have to be more like the routeLines
    if (this.arc) this.arc.setMap(this.map);

    // Zoom the map extent to the route line
    let includedThings = [];
    //TODO: BECKY eventually there may be more than one arc
    if (this.arc) {
      includedThings.push(this.arc);
      includedThings.push(new google.maps.LatLng(this.trip.origin.lat, this.trip.origin.lng));
      includedThings.push(new google.maps.LatLng(this.trip.destination.lat, this.trip.destination.lng));

    }
    
    if (selectedRouteLines && selectedRouteLines.length > 0) {
      includedThings = includedThings.concat(selectedRouteLines);
    }
    this.googleMapsHelpers.zoomToObjects(this.map, includedThings);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
