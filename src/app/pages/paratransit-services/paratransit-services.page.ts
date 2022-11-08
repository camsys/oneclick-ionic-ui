import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ItineraryModel } from 'src/app/models/itinerary';
import { OneClickServiceModel } from 'src/app/models/one-click-service';
import { TripResponseModel } from 'src/app/models/trip-response';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-paratransit-services',
  templateUrl: './paratransit-services.page.html',
  styleUrls: ['./paratransit-services.page.scss'],
})
export class ParatransitServicesPage implements OnInit {
  static routePath:string = '/paratransit_services';

  headerTitle: string;

  tripResponse: TripResponseModel;
  itinerary: ItineraryModel;
  transportationServices: OneClickServiceModel[];

  trip_id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private oneClick: OneClickService,
              private translate: TranslateService) {

    this.headerTitle = this.translate.instant("oneclick.pages.paratransit_services.header");
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.trip_id = +params.get('trip_id'); 

      if (this.router.getCurrentNavigation().extras.state) {
        let state = this.router.getCurrentNavigation().extras.state;

        this.itinerary = state.itinerary;
        this.tripResponse = state.trip_response;
      }
    });

    if (this.tripResponse) { // If a trip object is passed, load its services
      this.loadTripResponse(this.tripResponse);
    } else if (this.trip_id) { // If a trip_id is passed, get the trip from OneClick and load its services
      this.oneClick.getTrip(this.trip_id)
      .subscribe(trip => this.loadTripResponse(trip));
    } else { // Otherwise, make a call to OneClick for an index of all services
      this.oneClick.getParatransitServices()
      .then(tps => this.transportationServices = tps);
    }

    if (this.transportationServices && this.transportationServices.length == 1) {
      this.headerTitle = this.transportationServices[0].name;
    }
  }

  // Loads trip response data onto the page
  loadTripResponse(tripResponse: TripResponseModel) {
    this.tripResponse = new TripResponseModel(tripResponse).withFilteredItineraries('paratransit');
    if (this.itinerary) {
      this.tripResponse.itineraries = this.tripResponse.itineraries.slice(0).filter((itin) => itin === this.itinerary);
    }

    // If a trip response was sent via NavParams, pull the services out of it
    this.transportationServices = this.tripResponse.itineraries.map((itin) => {
      let svc = new OneClickServiceModel(itin.service);
      svc.fare = itin.cost;
      return svc;
     })
  }


}
