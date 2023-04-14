import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItineraryModel } from '../models/itinerary';
import { TripResponseModel } from '../models/trip-response';

@Injectable({
  providedIn: 'root'
})
export class DirectionsParamsService {

  private _params:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  
  constructor() { }

  get params$(): Observable<any> {
    return this._params.asObservable();
  }

  setParams(trip:TripResponseModel, itinerary:ItineraryModel) {
    let p = {
      trip: trip,
      itinerary: itinerary
    }
    this._params.next(p);
  }
}
