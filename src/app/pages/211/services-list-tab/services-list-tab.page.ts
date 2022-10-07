import { Component, OnInit } from '@angular/core';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { ServiceModel } from 'src/app/models/service';
import { Session } from 'src/app/models/session';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-services-list-tab',
  templateUrl: './services-list-tab.page.html',
  styleUrls: ['./services-list-tab.page.scss'],
})
export class ServicesListTabPage implements OnInit {

  services: ServiceModel[];
  service_count: number;
  orderBy: String;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private helpers: HelpersService,
              public events: Events) {
    this.services = navParams.data.services;
    this.service_count = navParams.data.service_count;
    this.orderMatchList("drive_time");
  }

  ngOnInit() {
  }

  // Orders the match list based on the passed string
  orderMatchList(orderBy: String) {
    if(orderBy == "transit_time") {
      this.orderByTransitTime();
    } else if(orderBy == "drive_time") {
      this.orderByDriveTime();
    } else {
      this.orderByDriveTime(); // by default, order by drive time
    }
    this.orderBy = orderBy;
  }

  orderByTransitTime()
  {
    let h = this.helpers;
    return this.services.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      return h.compareTimes(a.transit_time, b.transit_time);
    })
  }

  orderByDriveTime()
  {
    let h = this.helpers;
    return this.services.sort(function (a : ServiceModel, b : ServiceModel) {
      //sorts by shortest transit time
      return h.compareTimes(a.drive_time, b.drive_time);
    })
  }

  selectService(match : ServiceModel){
    let startLocation = this.session().user_starting_location;
    let destination_location = new GooglePlaceModel({
      address_components: null,
      geometry: {location: {lat: match.lat, lng: match.lng}},
      formatted_address: null,
      id: null,
      name: match.address
    });
    let departureDateTime = this.session().user_departure_datetime;
    let arriveBy = this.session().user_arrive_by;

    this.navCtrl.parent.viewCtrl._nav.push(ServiceFor211DetailPage, {service_id: match.service_id, location_id: match.location_id, origin: startLocation, destination: destination_location, departureDateTime: departureDateTime, arriveBy: arriveBy});
  }

  openEmailModal(services: ServiceModel[]) {
    let emailModal = this.modalCtrl.create(EmailModalPage, {services: services});
    emailModal.present();
  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

}
