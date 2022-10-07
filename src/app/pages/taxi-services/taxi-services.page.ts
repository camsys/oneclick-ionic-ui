import { Component, OnInit } from '@angular/core';
import { OneClickServiceModel } from 'src/app/models/one-click-service';
import { TripResponseModel } from 'src/app/models/trip-response';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-taxi-services',
  templateUrl: './taxi-services.page.html',
  styleUrls: ['./taxi-services.page.scss'],
})
export class TaxiServicesPage implements OnInit {

  trip: TripResponseModel;
  taxiServices: OneClickServiceModel[];

  trip_id: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClick: OneClickService) {

    this.trip_id = parseInt(navParams.data.trip_id);

  }

  // Loads the page with trip response data
  loadTrip(trip: TripResponseModel) {
    this.trip = new TripResponseModel(trip).withFilteredItineraries('taxi');
    this.taxiServices = this.trip.itineraries.map((itin) => {
      let svc = new OneClickServiceModel(itin.service);
      svc.fare = itin.cost;
      return svc;
    })
  }

  ngOnInit() {

    if(this.navParams.data.trip_response) {
      this.loadTrip(this.navParams.data.trip_response);
    } else if (this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
      .subscribe((tripResp) => this.loadTrip(tripResp));
    } else {
      this.navCtrl.setRoot(HelpMeFindPage); // If necessary navParams aren't present, go back to the home page
    }
  }


}
