import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ItineraryModel } from 'src/app/models/itinerary';
import { TripResponseModel } from 'src/app/models/trip-response';
import { OneClickService } from 'src/app/services/one-click.service';
import { HelpMeFindPage } from '../help-me-find/help-me-find.page';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.page.html',
  styleUrls: ['./directions.page.scss'],
})
export class DirectionsPage implements OnInit {
  static routePath: string = '/trip_directions';

  trip: TripResponseModel = new TripResponseModel({});
  itinerary: ItineraryModel;
  trip_id:number;
  mode: string = "";
  directionsParams: any;

  constructor(public navCtrl: NavController,
              private route: ActivatedRoute,
              private router: Router,
              private oneClick: OneClickService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.trip_id = +params.get('trip_id'); 

      if (this.router.getCurrentNavigation().extras.state) {
        let state = this.router.getCurrentNavigation().extras.state;

        this.trip = state.trip_response;
        this.itinerary = state.itinerary;
      }
    });

    if(this.trip) {
      if (this.itinerary) {
        this.displayItineraryResults(this.trip, this.itinerary);
      } else {
        this.displayTripResults(this.trip);
      }

    } else if(this.trip_id) {
      this.oneClick.getTrip(this.trip_id)
          .subscribe((trip) => {
            let newTripResponse = new TripResponseModel(trip) //.withFilteredItineraries(navData.mode);
            this.displayTripResults(newTripResponse);
          });



    } else {
      this.navCtrl.navigateRoot(HelpMeFindPage.routePath); // If necessary params aren't present, go back to the home page
    }
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
