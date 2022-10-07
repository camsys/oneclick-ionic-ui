import { Component, OnInit } from '@angular/core';
import { ItineraryModel } from 'src/app/models/itinerary';
import { TripResponseModel } from 'src/app/models/trip-response';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {

  trip: TripResponseModel = new TripResponseModel({});
  mode: string = "";
  stepsTab: any;
  mapTab: any;
  directionsParams: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private oneClick: OneClickService) {
    let navData = this.navParams.data;

    this.stepsTab = DirectionsStepsTabPage;
    this.mapTab = DirectionsMapTabPage;

    if(navData.trip_response) {
      if (navData.itinerary) {
        this.displayItineraryResults(navData.trip_response, navData.itinerary);
      } else {
        this.displayTripResults(navData.trip_response);
      }

    } else if(navData.trip_id) {
      this.oneClick.getTrip(this.navParams.data.trip_id)
          .subscribe((trip) => {
            let newTripResponse = new TripResponseModel(trip) //.withFilteredItineraries(navData.mode);
            this.displayTripResults(newTripResponse);
          });



    } else {
      this.navCtrl.setRoot(HelpMeFindPage); // If necessary navParams aren't present, go back to the home page
    }
  }

  ngOnInit() {

  }

  displayTripResults(trip: TripResponseModel): void {
    this.trip = trip;
    this.directionsParams = {
      trip: this.trip
    }
  }

  displayItineraryResults(trip: TripResponseModel, itinerary: ItineraryModel): void {
    this.trip = trip;
    this.directionsParams = {
      trip: this.trip,
      itinerary: itinerary

    }
  }


}
