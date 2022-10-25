import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ItineraryModel } from 'src/app/models/itinerary';
import { LegModel } from 'src/app/models/leg';
import { TripRequestModel } from 'src/app/models/trip-request';
import { TripResponseModel } from 'src/app/models/trip-response';
import { DirectionsParamsService } from 'src/app/services/directions-params.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { LoaderService } from 'src/app/services/loader.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { ServiceFor211ModalPage } from '../211/service-for211-modal/service-for211-modal.page';
import { DirectionsPage } from '../directions/directions.page';
import { EmailItineraryModalPage } from '../email-itinerary-modal/email-itinerary-modal.page';

@Component({
  selector: 'app-directions-steps-tab',
  templateUrl: './directions-steps-tab.page.html',
  styleUrls: ['./directions-steps-tab.page.scss'],
})
export class DirectionsStepsTabPage implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  trip:TripResponseModel;
  mode:string;
  itineraries: ItineraryModel[] = [];
  itinerary: ItineraryModel;
  selectedItinerary: string; // Index of selected itinerary within the itineraries array
  tripRequest:TripRequestModel;
  departAtTime: string; // For storing user-defined depart at time (including date)
  arriveByTime: string; // For storing user-defined arrive by time (including date)
  tripDate: string; // For storing the user-defined trip date (including time)

  constructor(private router: Router,
              public oneClickProvider: OneClickService,
              public helpers: HelpersService,
              public changeDetector: ChangeDetectorRef,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private translate: TranslateService,
              private loader: LoaderService,
              private dirParamsService: DirectionsParamsService
  ) {

    
    
  }

  ngOnInit() { 
    this.dirParamsService.params$.pipe(takeUntil(this.unsubscribe)).subscribe(
      (params: any) => {
        if (params) {
          this.trip = params.trip;
          this.itinerary = params.itinerary;

          this.finishInitialization();
        }
      }
    );

  }

  finishInitialization() {
    if (this.trip && this.itinerary) {
      this.itineraries = this.trip.itineraries.slice(0).filter((itin) => itin === this.itinerary).map(function(itin) {
        itin.legs = itin.legs.map(function(legAttrs) {
          return new LegModel().assignAttributes(legAttrs);
        });
        return itin;
      });
    } else if (this.trip) {
      this.itineraries = this.trip.itineraries.map(function(itin) {
        itin.legs = itin.legs.map(function(legAttrs) {
          return new LegModel().assignAttributes(legAttrs);
        });
        return itin;
      });

    }
    //else this.itineraries = [];

    this.selectedItinerary = "0";

    if (this.trip) {
      this.tripRequest = this.trip.buildTripRequest();
      
      // Sets trip date, arrive_by and depart_at time
      this.tripDate = this.trip.trip_time;
      if (this.itineraries) this.setArriveByAndDepartAtTimes();
    }
  }

  openEmailModal() {
    if (this.itinerary) {
      this.modalCtrl.create({
        component: EmailItineraryModalPage, 
        componentProps: {
          itinerary: this.itinerary
        }}).then(emailModal => emailModal.present());
    }
  }

  selectService(id: number) {
    this.oneClickProvider.getServiceDetails(id)
      .subscribe((svc) => {
        this.modalCtrl.create({
          component: ServiceFor211ModalPage,
          componentProps: { 
            service: svc 
          }
        }).then(modal => {
          modal.onDidDismiss().then(resp => {
            if (resp && resp.data) {
              this.toastCtrl.create({
                message: (resp.data.status === 200 ? this.translate.instant("oneclick.pages.feedback.success_message") :
                                                this.translate.instant("oneclick.pages.feedback.error_message")),
                position: 'bottom',
                duration: 3000
              }).then(toast => toast.present());
            }
          });
          return modal;
        }).then(serviceModal => serviceModal.present());    
      });

  }


  // When depart at time is updated, submit new trip plan request with arrive_by = false
  updateDepartAt(t: string) {
    this.departAtTime = t;
    this.tripRequest.trip.arrive_by = false;
    this.tripRequest.trip.trip_time = this.departAtTime;
    this.replanTrip();
  }

  // When arrive by time is updated, submit new trip plan request with arrive_by = true
  updateArriveBy(t: string) {
    this.arriveByTime = t;
    this.tripRequest.trip.arrive_by = true;
    this.tripRequest.trip.trip_time = this.arriveByTime;
    this.replanTrip();
  }

  // When the trip date is changed, submit a new trip plan request with the new date and same time
  updateTripDate(t: string) {
    this.tripDate = t;
    this.tripRequest.trip.trip_time = this.tripDate;
    this.replanTrip();
  }

  // Makes a new trip request and reloads the Directions page.
  replanTrip() {
    this.loader.showLoader();

    this.oneClickProvider.planTrip(this.tripRequest)
    .subscribe((resp) => {
      this.loader.hideLoader();

      this.router.navigate([DirectionsPage.routePath], {
        state: {
          trip_response: resp,
          mode: this.mode
        }
      });
    });
  }

  // Fires every time a new itinerary is selected
  selectItinerary(evt) {
    this.setArriveByAndDepartAtTimes(); // Update datepicker times based on newly selected itinerary
    this.changeDetector.markForCheck();
  }

  // Sets the arrive by and depart at times in the time pickers based on trip and selected itinerary
  setArriveByAndDepartAtTimes() {
    let h = this.helpers; // for date manipulation methods

    // ITINERARY TIMES
    let itin = this.itineraries[parseInt(this.selectedItinerary)];

    // Have to do some funky math to get these to show up in the proper time zone...
    let itinStartTime:any = new Date(itin.legs[0].startTime).valueOf(); // Convert itinerary start time to milliseconds since epoch
    itinStartTime = h.roundDownToNearest(itinStartTime, 60000 * 15); // Round down to nearest 15 min.
    itinStartTime = h.dateISOStringWithTimeZoneOffset(new Date(itinStartTime)); // Format as ISO String with TZ offset

    let itinEndTime:any = new Date(itin.legs[itin.legs.length - 1].endTime).valueOf(); // Convert itinerary end time to milliseconds since epoch
    itinEndTime = h.roundUpToNearest(itinEndTime, 15 * 60000);  // Round up to nearest 15 min.
    itinEndTime = h.dateISOStringWithTimeZoneOffset(new Date(itinEndTime)); // Format as ISO String with TZ offset

    // TRIP TIMES
    // Trip's trip_time in milliseconds since epoch
    let tripTimeInMS:any = Date.parse(this.trip.trip_time);

    // Round to nearest 15 min (up and down) and format as ISO string with TZ offset
    let tripArriveByTime:any = h.roundUpToNearest(tripTimeInMS, 15 * 60000);
    tripArriveByTime = h.dateISOStringWithTimeZoneOffset(new Date(tripArriveByTime));
    let tripDepartAtTime:any = h.roundDownToNearest(tripTimeInMS, 15 * 60000);
    tripDepartAtTime = h.dateISOStringWithTimeZoneOffset(new Date(tripDepartAtTime));

    // Set arrive by and depart at time to the trip time or the itinerary start/end time,
    // depending on the trip's arrive_by boolean.
    this.arriveByTime = this.trip.arrive_by ? tripArriveByTime : itinEndTime;
    this.departAtTime = this.trip.arrive_by ? itinStartTime : tripDepartAtTime;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
