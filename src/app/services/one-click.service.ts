import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AgencyModel } from '../models/agency';
import { Alert } from '../models/alert';
import { CategoryFor211Model } from '../models/category-for-211';
import { County } from '../models/county';
import { FeedbackModel } from '../models/feedback';
import { FindServicesHistoryModel } from '../models/find-services-history';
import { GooglePlaceModel } from '../models/google-place';
import { OneClickHttpResponse } from '../models/one-click-http-response';
import { OneClickServiceModel } from '../models/one-click-service';
import { SearchResultModel } from '../models/search-result';
import { ServiceModel } from '../models/service';
import { SubSubcategoryFor211Model } from '../models/sub-subcategory-for-211';
import { SubcategoryFor211Model } from '../models/subcategory-for-211';
import { TripRequestModel } from '../models/trip-request';
import { TripResponseModel } from '../models/trip-response';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class OneClickService {

  public oneClickUrl = environment.BASE_ONECLICK_URL;

  private _httpError:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private _tripPurposes:BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  get tripPurposes():Observable<any> {
    return this._tripPurposes.asObservable();
  }

  constructor(public http: HttpClient,
    private toastCtrl: ToastController,
    private translate: TranslateService,
              private auth: AuthService,
              private i18n: I18nService) {}

  get httpError(): Observable<any> {
    return this._httpError.asObservable();
  }

  // Constructs a request options hash with auth headers
  requestOptions(): { headers: HttpHeaders } {
    return { headers: this.auth.authHeaders() };
  }

  // Gets a list of all Transportation Agencies
  getTransportationAgencies(): Promise<AgencyModel[]> {
    return this.getAgencies("transportation");
  }

  // Gets a list of all Partner Agencies
  getPartnerAgencies(): Promise<AgencyModel[]> {
    return this.getAgencies("partner");
  }

  // Gets a list of ALL agencies, regardless of type
  getAllAgencies(): Promise<AgencyModel[]> {
    return this.getAgencies("");
  }

  // Gets OneClick global landmarks and user's stomping grounds based on a query string
  public getPlaces(places_query: String ): Observable<GooglePlaceModel[]> {
    return this.http
     .get<OneClickHttpResponse>(this.oneClickUrl + "places?name=" + places_query + "&max_results=10", this.requestOptions()).pipe(
     map( (response) => {
       return response.data.places as GooglePlaceModel[];
     }));
  }

  // Gets users stomping grounds
  public getStompingGrounds(): Observable<GooglePlaceModel[]> {
    return this.http
      .get<OneClickHttpResponse>(this.oneClickUrl + "stomping_grounds", this.requestOptions()).pipe(
      map( (response) => {
        return response.data.stomping_grounds as GooglePlaceModel[];
      }));
  }

  public getAgencies(type: String): Promise<AgencyModel[]> {
    let uri: string = encodeURI(this.oneClickUrl +
      'agencies?type=' + type +
      '&locale=' + this.i18n.currentLocale()
    );

    return this.http.get<any>(uri)
      .pipe(
        map(result => result.data)
      )
      .toPromise()
      .catch(error => this.handleError(error).toPromise());
  }

  public getCounties(): Promise<County[]> {
     var uri: string = encodeURI(this.oneClickUrl + 'counties');
     return this.http.get<any>(uri, this.requestOptions())
      .pipe(
        map(result => result.data)
      )
      .toPromise()
      .catch(error => this.handleError(error).toPromise());
  }

  // Gets all paratransit services from OneClick
  public getParatransitServices(): Promise<OneClickServiceModel[]> {
    let uri: string = encodeURI(this.oneClickUrl +
      'services?type=paratransit' +
      '&locale=' + this.i18n.currentLocale()
    );

    return this.http.get<OneClickHttpResponse>(uri)
      .toPromise()
      .then(response => response.data.services as OneClickServiceModel[])
      .catch(error => this.handleError(error).toPromise());
  }

  // Gets a User from 1-Click
  getProfile(): Promise<User>{
     var uri: string = encodeURI(this.oneClickUrl + 'users');
     return this.http.get(uri, this.requestOptions())
      .toPromise()
      .then((response) => this.unpackUserResponse(response))
      .catch(error => this.handleError(error).toPromise());
  }

  // Updates a User in 1-Click
  updateProfile(user: User): Promise<User>{
    let formatted_accs = {};
    let formatted_eligs = {};
    let formatted_trip_types = {};

    for (let acc of user.accommodations) {
      formatted_accs[acc.code] = acc.value;
    }

    for (let elig of user.eligibilities) {
      formatted_eligs[elig.code] = elig.value;
    }

    for (let trip_type of user.trip_types){
      formatted_trip_types[trip_type.code] = trip_type.value;
    }

    let attributes = {
      "first_name": user.first_name,
      "last_name": user.last_name,
      "email": user.email,
      "age": user.age,
      "preferred_locale": user.preferred_locale,
      "county": user.county,
      "paratransit_id": user.paratransit_id
    }

    if(user.password && user.password_confirmation) {
      attributes["password"] = user.password;
      attributes["password_confirmation"] = user.password_confirmation;
    }

    let body = {
      "attributes": attributes,
      "accommodations": formatted_accs,
      "eligibilities": formatted_eligs,
      "trip_types": formatted_trip_types
    };

    var uri: string = encodeURI(this.oneClickUrl + 'users');
    return this.http.put(uri, body, this.requestOptions())
      .toPromise()
      .then((response) => this.unpackUserResponse(response))
      .catch(error => this.handleError(error).toPromise());
  }

  // Unpacks a OneClick user response and stores the user in the session
  unpackUserResponse(response): User {
    let user = response.data.user as User;
    return this.auth.updateSessionUser(user); // store user info in session storage
  }

  getCategoryByCode(code: string): Observable<CategoryFor211Model> {
    let url: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/categories/' + code +
      '?locale=' + this.i18n.currentLocale()
    );

    return this.http.get<CategoryFor211Model>(url).pipe(
      catchError(error => this.handleError(error)));
  }

  getCategoriesFor211Services(lat: number, lng: number): Promise<CategoryFor211Model[]> {
    let uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/categories?locale=' +
      this.i18n.currentLocale()
    );

    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get<CategoryFor211Model[]>(uri)
      .toPromise()
      .then(categories => this.filterEmptyCategories(categories))
      .catch(error => this.handleError(error).toPromise());
  }

  getSubCategoryByCode(code: string): Observable<SubcategoryFor211Model> {
    let url: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/sub_categories/' + code +
      '?locale=' + this.i18n.currentLocale()
    );

    return this.http.get<SubcategoryFor211Model>(url).pipe(
      catchError(error => this.handleError(error)));
  }

  getSubcategoryForCategoryName(categoryName: string, lat: number, lng: number): Promise<SubcategoryFor211Model[]> {
    let uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/sub_categories?category=' +
      categoryName +
      '&locale=' +
      this.i18n.currentLocale()
    );

    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get<SubcategoryFor211Model[]>(uri)
      .toPromise()
      .then(subCats => this.filterEmptyCategories(subCats))
      .catch(error => this.handleError(error).toPromise());
  }

  getSubSubCategoryByCode(code: string): Observable<SubSubcategoryFor211Model> {
    let url: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/sub_sub_categories/' + code +
      '?locale=' + this.i18n.currentLocale()
    );

    return this.http.get<SubSubcategoryFor211Model>(url).pipe(
      catchError(error => this.handleError(error)));
  }

  getSubSubcategoryForSubcategoryName(subcategoryName: string, lat: number, lng: number): Promise<SubSubcategoryFor211Model[]>{

    let uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/sub_sub_categories?sub_category=' +
      subcategoryName +
      '&locale=' +
      this.i18n.currentLocale()
    );

    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get<SubSubcategoryFor211Model[]>(uri)
      .toPromise()
      .then(subSubCats => this.filterEmptyCategories(subSubCats))
      .catch(error => this.handleError(error).toPromise());
  }

  // Gets ReferNET 211 service details
  get211ServiceDetails(serviceId: string, locationId: string): Observable<ServiceModel> {
    let url = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/services/details?' +
      'location_id=' + locationId +
      '&service_id=' + serviceId +
      '&locale=' + this.i18n.currentLocale()
    );

    return this.http.get<ServiceModel>(url).pipe(
      catchError(error => this.handleError(error)));
  }

  getServiceDetails(id: number): Observable<OneClickServiceModel> {
    let url = encodeURI(
      this.oneClickUrl +
      'services/' +
      id +
      '?locale=' + this.i18n.currentLocale()
    );

    return this.http.get(url).pipe(
      map(response => this.unpackServiceResponse(response)),
      catchError(error => this.handleError(error)));
  }

  // Gets refernet services based on subsubcategory name, and optional lat/lng
  getServicesFromSubSubCategoryName(subSubCategoryName: string, lat: number, lng: number): Promise<ServiceModel[]>{
    var uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/services?sub_sub_category=' +
      subSubCategoryName +
      '&locale=' +
      this.i18n.currentLocale()
    );

    // Add lat & lng params
    if(lat && lng) { uri += ('&lat=' + lat + '&lng=' + lng); }

    return this.http.get<ServiceModel[]>(uri)
      .toPromise()
      .catch(error => this.handleError(error).toPromise());
  }

  // Create find services history records from Find Services workflow.
  createFindServicesHistory(formatted_address: string, lat: number, lng: number, subSubCategoryName: string): Observable<FindServicesHistoryModel> {
    let uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/create_find_services_history'
    );

    var request = { formatted_address: formatted_address, lat: lat, lng: lng, sub_sub_category_name: subSubCategoryName, locale: this.i18n.currentLocale()};

    return this.http.post(uri, request, this.requestOptions()).pipe(
               map(response => this.unpackFindServicesHistoryResponse(response)),
               catchError(error => this.handleError(error)));
  }

  // Update find services history records from Find Services workflow.
  // Modify history record to add associated trip id for trip planned through services.
  updateFindServicesHistoryTripId(find_services_history_id: number, trip_id: number): Observable<FindServicesHistoryModel> {
    let uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/update_find_services_history_trip_id'
    );

    var request = { find_services_history_id: find_services_history_id, trip_id: trip_id, locale: this.i18n.currentLocale()};

    return this.http.post(uri, request, this.requestOptions()).pipe(
               map(response => this.unpackFindServicesHistoryResponse(response)),
               catchError(error => this.handleError(error)));
  }

  // Plans a trip via OneClick, and returns the result
  planTrip(tripRequest: TripRequestModel): Observable<TripResponseModel> {
    let uri = encodeURI(this.oneClickUrl +
                        'trips/plan?locale=' +
                        this.i18n.currentLocale());

    return this.http
            .post(uri, tripRequest, this.requestOptions()).pipe(
            map(response => this.unpackTripResponse(response)),
            catchError(error => this.handleError(error)));
  }

  // Gets an already-planned trip, based on trip ID (and user auth)
  getTrip(tripId: number): Observable<TripResponseModel> {
    let uri = encodeURI(this.oneClickUrl +
                        'trips/' + tripId +
                        '?locale=' + this.i18n.currentLocale());

    return this.http.get(uri, this.requestOptions()).pipe(
               map(response => this.unpackTripResponse(response)),
               catchError(error => this.handleError(error)));
  }

  newTrip(): Observable<TripResponseModel> {
    let uri = encodeURI(this.oneClickUrl +
      'trips/new?locale=' + this.i18n.currentLocale());


    return this.http.get(uri, this.requestOptions()).pipe(
      map(response => this.unpackTripResponse(response)),
      catchError(error => this.handleError(error)));
  }

  getAlerts(): Promise<Alert[]>{
    let uri = encodeURI(this.oneClickUrl +
                        'alerts?locale=' +
                        this.i18n.currentLocale())

    return this.http
               .get<OneClickHttpResponse>(uri, this.requestOptions())
               .toPromise()
               .then(response => response.data.user_alerts as Alert[])
               .catch(error => this.handleError(error).toPromise());
  }

  ackAlert(alert: Alert){

    if(alert.id == null){
      return
    }

    let body = {
      "user_alert": {
        "acknowledged": true
      }
    };

    return this.http
               .put(this.oneClickUrl+'alerts/'+alert.id, body, this.requestOptions())
               .toPromise()
               .catch(error => this.handleError(error));
  }

  // Creates a feedback, including rating and review, for a service
  createFeedback(feedback: FeedbackModel): Promise<any> {

    return this.http
               .post(this.oneClickUrl + 'feedbacks', { feedback: feedback}, this.requestOptions())
               .toPromise()
               .catch(error => this.handleError(error));
  }

  // Gets a list of the user's feedbacks
  getFeedbacks(): Observable<FeedbackModel[]> {

    return this.http
               .get<OneClickHttpResponse>(this.oneClickUrl + 'feedbacks', this.requestOptions()).pipe(
               map(response => {
                 return (response.data.feedbacks as FeedbackModel[]);
               }),
               catchError(error => this.handleError(error)));
  }

  getTripPurposes(): Observable<any[]> {
    const uri: string = `${this.oneClickUrl}trip_purposes?locale=${this.i18n.currentLocale()}`;
    return this.http.get<any>(uri, this.requestOptions())
      .pipe(
        map(response => {
          console.log('Received trip purposes:', response.data.purposes);
          this._tripPurposes.next(response.data.purposes);
          return response.data.purposes;
        }),
        catchError(error => {
          console.error('An error occurred', error);
          return this.handleError(error);
        })
      );
  }  
  

  // Makes a refernet keyword search call, returning the results array
  refernetKeywordSearch(term: string, typeFilter: string = ""): Observable<SearchResultModel[]> {
    var uri: string = encodeURI(
      this.oneClickUrl +
      'oneclick_refernet/search?term=' + term +
      '&locale=' + this.i18n.currentLocale() +
      '&type=' + typeFilter);

    return this.http.get<any>(uri).pipe(
      map(incoming => { 
        return incoming.results;
      })
      );
  }

  emailItinerary(email: string, itinerary_id: number): Promise<any> {
    return this.http
      .post(this.oneClickUrl + 'itineraries/email',
        { email_address:  email, itinerary_id: itinerary_id, locale: this.i18n.currentLocale()},
        this.requestOptions())
      .toPromise()
      .catch(error => this.handleError(error));
  }

  // Email 211 Services
  email211Service(email: string, id: number[]): Promise<any> {
    return this.http
            .post(this.oneClickUrl + 'oneclick_refernet/email',
                  { email:  email, "services": id, locale: this.i18n.currentLocale()},
                  this.requestOptions())
            .toPromise()
            .catch(error => this.handleError(error));
  }

  // SMS 211 Services
  sms211Service(phone: string, id: number[]): Promise<any> {
    return this.http
            .post(this.oneClickUrl + 'oneclick_refernet/sms',
                  { phone:  phone, "services": id, locale: this.i18n.currentLocale()},
                  this.requestOptions())
            .toPromise()
            .catch(error => null);
  }

  // Unsubscribes user from email updates
  unsubscribeUser(email: string): Observable<Boolean> {
    let uri = encodeURI(this.oneClickUrl +
                        'users/unsubscribe?locale=' +
                        this.i18n.currentLocale());

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-Email': email
    });
    let requestOpts = { headers: headers };

    return this.http
            .post<OneClickHttpResponse>(uri, {}, requestOpts).pipe(
            map(response => response.status === 200),
            catchError(error => this.handleError(error)));
  }

  // Handle errors by console logging the error, and publishing an error event
  // for consumption by the app's home page.
  private handleError(error: any) {
    console.error('An error occurred', error, this); // for demo purposes only
    this._httpError.next(error);
    return EMPTY; // return an empty observable so subscribe calls don't break
  }

  // // Console log the error and pass along a rejected promise... if uncaught
  // // by the calling component, will still raise an error.
  // private handleError(error: any): any {
  //   console.error('An error occurred', error); // for demo purposes only
  //   return Promise.reject(error);
  // }

  // Filters out any categories without associated services
  private filterEmptyCategories(categories: any[]): any[] {
    return categories.filter(cat => cat.service_count > 0);
  }

  private unpackFindServicesHistoryResponse(response: any): FindServicesHistoryModel {

    let find_services_history = (response.data.find_services_history as FindServicesHistoryModel);
    let user = find_services_history.user as User;

    if (find_services_history) {
      this.auth.setFindServicesHistoryId(find_services_history.id);
    }

    if (user) {
      // If no user is signed in, OR the user is signed in as the user
      // returned by the call, store returned user info in the session.
      if (!this.auth.isSignedIn() || this.auth.isSignedIn(user)) {
        this.auth.updateSessionUser(user);
      }
    }

    return find_services_history;
  }

  private unpackTripResponse(response: any): TripResponseModel {
    let errors = response.errors;
    if (errors && errors.length > 0) {
      this.toastCtrl.create({
        message: this.translate.instant('downstream_services_errors_message'),
        position: 'bottom',
        duration: 3000
      }).then(toast => toast.present());
    }

    let trip = (response.data.trip as TripResponseModel);
    let user = trip.user as User;

    if (user) {
      // If no user is signed in, OR the user is signed in as the user
      // returned by the trip plan call, store returned user info in the session.
      if(!this.auth.isSignedIn() || this.auth.isSignedIn(user)) {
        this.auth.updateSessionUser(user);
      }
    }

    return trip;
  }

  private unpackServiceResponse(response: any): OneClickServiceModel {

    let data = response.data;

    if (data.transit) {
      return (data.transit as OneClickServiceModel);
    }
    if (data.paratransit) {
      return (data.paratransit as OneClickServiceModel);
    }

    return null;
  }

}
