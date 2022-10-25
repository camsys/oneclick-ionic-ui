import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { ServiceModel } from 'src/app/models/service';
import { Session } from 'src/app/models/session';
import { HelpersService } from 'src/app/services/helpers.service';
import { ServicesParamsService } from 'src/app/services/services-params.service';
import { EmailModalPage } from '../../email-modal/email-modal.page';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail.page';

@Component({
  selector: 'app-services-list-tab',
  templateUrl: './services-list-tab.page.html',
  styleUrls: ['./services-list-tab.page.scss'],
})
export class ServicesListTabPage implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  services: ServiceModel[];
  service_count: number;
  orderBy: String;

  constructor(private router: Router,
              public modalCtrl: ModalController,
              private helpers: HelpersService,
              private servicesParamsService: ServicesParamsService) {

  }

  ngOnInit() {

    this.servicesParamsService.params$.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params: any) => {
        if (params) {
          this.services = params.services;
          this.service_count = params.service_count;
        }

        if (this.services) this.orderMatchList("drive_time");
      }
    );

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

    this.router.navigate(
      [ServiceFor211DetailPage.routePath, match.service_id, match.location_id],
      {state : { 
        origin: startLocation, 
        destination: destination_location, 
        departureDateTime: departureDateTime, 
        arriveBy: arriveBy
      }
    });
  }

  openEmailModal(services: ServiceModel[]) {
    this.modalCtrl.create({
      component: EmailModalPage, 
      componentProps: {
        services: services
      }
    }).then(emailModal => emailModal.present());
  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || null) as Session);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
