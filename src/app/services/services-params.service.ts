import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceModel } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServicesParamsService {

  private _params:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  
  constructor() { }

  get params$(): Observable<any> {
    return this._params.asObservable();
  }

  setParams(services: ServiceModel[], service_count: number) {
    let p = {
      services: services,
      service_count: service_count
    }
    this._params.next(p);
  }
}
