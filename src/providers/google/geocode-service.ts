import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { environment } from '../../app/environment';

import { GooglePlaceModel } from "../../models/google-place";
import { AddressComponentModel } from '../../models/address-component';

@Injectable()
export class GeocodeServiceProvider {
  googleAutoCompleteService = new google.maps.places.AutocompleteService();
  googleGeoCoder = new google.maps.Geocoder();

  // Zipcodes within service area of Find Services workflow.
  servicesZipcodes: number[] = [];
  // Zipcodes within service area of Find Transportation workflow.
  transportationZipcodes: number[] = [];

  constructor(public http: Http) {
    this.servicesZipcodes = environment.SERVICES_ZIPCODES;
    this.transportationZipcodes = environment.TRANSPORTATION_ZIPCODES;
  }

  public getGooglePlaces(address_query: string): Observable<GooglePlaceModel[]>{

    let placesObservable: Observable<GooglePlaceModel[]> = Observable.create(obs => {
      let predictionFormatter = function (predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          // obs.error(status);
          console.error(status);
          obs.next([]);
          obs.complete();
        }
        else {
          let mockedPlaces = [];

          predictions.forEach(function (prediction) {
            let place = new GooglePlaceModel({
              address_components: null,
              geometry: null,
              formatted_address: prediction.description,
              id: null,
              name: null
            });
            mockedPlaces.push(place);
          });

          obs.next(mockedPlaces);
          obs.complete();
        }
      };

      this.googleAutoCompleteService.getPlacePredictions({ input: address_query, componentRestrictions: {country: 'US'} }, predictionFormatter);
    });

    return placesObservable;
  }

  public getPlaceFromLatLng(lat: number, lng: number): Observable<GooglePlaceModel[]>{
    return this.geocode({
      location: { lat: lat, lng: lng }
    });
  }
  public getPlaceFromFormattedAddress(place: GooglePlaceModel): Observable<GooglePlaceModel[]>{
    return this.geocode({ 
      address: place.formatted_address, 
      componentRestrictions: {country: 'US'} 
    });
  }

  private geocode(request): Observable<GooglePlaceModel[]>{
    let scope = this;

    let placesObservable: Observable<GooglePlaceModel[]> = Observable.create(obs => {
      let placeFormatter = function (locationResult, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          obs.error(status);
        }
        else {
          let addressGeolocated = [];
          locationResult.forEach( function (location) {
            addressGeolocated.push(scope.buildPlaceModelFromGeoCoderResult(location));
          });

          obs.next(addressGeolocated);
          obs.complete();
        }
      };

      this.googleGeoCoder.geocode(request, placeFormatter);
    });

    return placesObservable;
  }

  private buildPlaceModelFromGeoCoderResult(result: google.maps.GeocoderResult): GooglePlaceModel {
    return new GooglePlaceModel({
      address_components: result.address_components as AddressComponentModel[],
      geometry: { location: { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() } },
      formatted_address: result.formatted_address,
      place_id: result.place_id,
      types: result.types
    });
  }

  // Check if the Google place's zipcode is within service area zipcodes of Find Services workflow.
  public isZipcodeOutOfAreaForServices(place: GooglePlaceModel): boolean {
    let postalCode = place.address_components.find(function (component) {
      return component.types[0] == "postal_code";
    });
    if (postalCode && postalCode.short_name && 
      this.servicesZipcodes.indexOf(parseInt(postalCode.short_name, 10)) == -1) {
      return true;
    }
    return false;
  }

  // Check if the Google place's zipcode is within service area zipcodes of Find Transportation workflow.
  public isZipcodeOutOfAreaForTransportation(place: GooglePlaceModel): boolean {
    let postalCode = place.address_components.find(function (component) {
      return component.types[0] == "postal_code";
    });
    if (postalCode && postalCode.short_name && 
      this.transportationZipcodes.indexOf(parseInt(postalCode.short_name, 10)) == -1) {
      return true;
    }
    return false;
  }
}
