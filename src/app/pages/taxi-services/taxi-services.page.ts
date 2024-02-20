import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OneClickServiceModel } from 'src/app/models/one-click-service';
import { TripResponseModel } from 'src/app/models/trip-response';
import { OneClickService } from 'src/app/services/one-click.service';
import { HelpMeFindPage } from '../help-me-find/help-me-find.page';

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
              private route: ActivatedRoute,
              private router: Router,
              public oneClick: OneClickService) {}

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
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.trip_id = +params.get('trip_id'); 

      if (this.router.getCurrentNavigation().extras.state) {
        let state = this.router.getCurrentNavigation().extras.state;

        this.trip = state.trip_response;
      }
    });

    if (this.trip) {
      this.loadTrip(this.trip);
    } else if (this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
      .subscribe((tripResp) => this.loadTrip(tripResp));
    } else {
      this.navCtrl.navigateRoot('/'); // If necessary navParams aren't present, go back to the home page
    }
  }


}
