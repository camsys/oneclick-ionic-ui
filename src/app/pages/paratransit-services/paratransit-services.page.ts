import { Component, OnInit } from '@angular/core';
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

  headerTitle: string;

  tripResponse: TripResponseModel;
  itinerary: ItineraryModel;
  transportationServices: OneClickServiceModel[];

  trip_id: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClick: OneClickService,
              private translate: TranslateService) {

    this.trip_id = this.navParams.data.trip_id;
    this.transportationServices = null;
    if (this.navParams.data.itinerary) {
      this.itinerary = this.navParams.data.itinerary;
    }

    this.headerTitle = this.translate.instant("oneclick.pages.paratransit_services.header");
  }

  ngOnInit() {

    if(this.navParams.data.trip_response) { // If a trip object is passed, load its services
      this.loadTripResponse(this.navParams.data.trip_response);
    } else if(this.trip_id) { // If a trip_id is passed, get the trip from OneClick and load its services
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
