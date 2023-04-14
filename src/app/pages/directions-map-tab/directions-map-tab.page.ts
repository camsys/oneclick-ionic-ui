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
  itinerary: ItineraryModel;
  map: google.maps.Map;
  routeLines: google.maps.Polyline[] = [];
  arcs: google.maps.Marker[] = [];
  startMarker: google.maps.Marker;
  endMarker: google.maps.Marker;

  constructor(public geoServiceProvider: GeocodeService,
              private googleMapsHelpers: GoogleMapsHelpersService,
              private dirParamsService: DirectionsParamsService,
              public changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.dirParamsService.params$.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params: any) => {
        if (params) {
          this.trip = params.trip;
          this.itinerary = params.itinerary;


          this.initializeMap();
        }
      }
    );

  }


  updateArcMarkerForZoom(start: google.maps.LatLng, end: google.maps.LatLng, arcIndex:number): Function {
    return (): void  => {
      if (!this.arcs) return;
      this.updateArcMarker(start, end, arcIndex);
    }
  }

  updateArcMarkerForProjection(start: google.maps.LatLng, end: google.maps.LatLng, arcIndex:number): Function {
    return (): void  => {
      if (!this.arcs) return;
      this.updateArcMarker(start, end, arcIndex);
      this.drawSelectedRoute();//need to make sure drawing happens on projection change
    }
  }

  //create or update the specified arc
  updateArcMarker(start: google.maps.LatLng, end: google.maps.LatLng, arcIndex:number) {
      this.arcs[arcIndex] = this.googleMapsHelpers.createUpdateArc(
        this.arcs[arcIndex],
        this.map,
        start,
        end);
  }

  // Sets up the google map
  initializeMap() {
    this.map = this.googleMapsHelpers.buildGoogleMap('directions-route-map-canvas');

    this.googleMapsHelpers.addParticipatingCountiesLayer(this.map);

    let me = this;


    //Consider if there are legs first.  They resort to a basic origin/destination arc if no legs available
    if (this.itinerary && this.itinerary.legs) {
      this.routeLines = [];
      let currentArcIndex = 0;
      this.itinerary.legs.forEach(function(leg) {

        if (leg.isFlex()) {
          let start = new google.maps.LatLng(leg.from.lat, leg.from.lon);//for now this will be the start of the arc
          let end = new google.maps.LatLng(leg.to.lat, leg.to.lon);//for now this will be the end of the arc
          google.maps.event.addListener(me.map, 'projection_changed', me.updateArcMarkerForProjection(start, end, currentArcIndex).bind(me));
          google.maps.event.addListener(me.map, 'zoom_changed', me.updateArcMarkerForZoom(start, end, currentArcIndex).bind(me));
          currentArcIndex++;
        }
        else {
          let routePoints = google.maps.geometry.encoding
                            .decodePath(leg.legGeometry.points); // Convert the itinerary's leg geometry into an array of google latlngs
          let routeLine = me.googleMapsHelpers.drawRouteLine(routePoints, leg.mode); // Build the route line object

          me.routeLines.push(routeLine);
        }
      })
    } else if (this.itinerary && this.itinerary.trip_type == 'paratransit') {//to cover cases with legless paratransit
      let start = new google.maps.LatLng(this.trip.origin.lat, this.trip.origin.lng);//for now this will be the start of the arc
      let end = new google.maps.LatLng(this.trip.destination.lat, this.trip.destination.lng);//for now this will be the end of the arc
      google.maps.event.addListener(this.map, 'projection_changed', this.updateArcMarkerForProjection(start, end, 0).bind(this));
      google.maps.event.addListener(this.map, 'zoom_changed', this.updateArcMarkerForZoom(start, end, 0).bind(this));
    }

    // TODO: Get start and end icons to look good
    // Set the start and end markers


    this.startMarker = new google.maps.Marker({
      // icon: startIcon,
      label: 'A',
      position: { lat: parseFloat(this.trip.origin.lat.toString()), lng: parseFloat(this.trip.origin.lng.toString()) },
      map: this.map
    });


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
    if (this.routeLines) this.routeLines.forEach((rl) => rl.setMap(null));
    if (this.arcs) this.arcs.forEach((a) => a.setMap(null));

    // Draw the selected route lines on the map
    if (this.routeLines) this.routeLines.forEach((rl) => rl.setMap(this.map));
    if (this.arcs) this.arcs.forEach((a) => a.setMap(this.map));

    //figure out what needs to be shown on the map
    let includedThings = [];
    if (this.arcs) {
      includedThings = includedThings.concat(this.arcs);
      includedThings.push(new google.maps.LatLng(this.trip.origin.lat, this.trip.origin.lng));
      includedThings.push(new google.maps.LatLng(this.trip.destination.lat, this.trip.destination.lng));

    }
    if (this.routeLines) {
      includedThings = includedThings.concat(this.routeLines);
    }

    // Zoom the map extent to include everything
    this.googleMapsHelpers.zoomToObjects(this.map, includedThings);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
