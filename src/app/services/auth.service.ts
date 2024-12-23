import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { asyncScheduler, BehaviorSubject, Observable, scheduled, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { GooglePlaceModel } from '../models/google-place';
import { Session } from '../models/session';
import { appConfig } from 'src/environments/appConfig';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userUpdated:BehaviorSubject<User> = new BehaviorSubject<User>(undefined);
  private _userSignedOut:Subject<any> = new Subject<any>();

  public baseUrl = environment.BASE_ONECLICK_URL;
  public defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })
  public recentPlacesLength: number = 10; // Max # of places in a recent places list
  public guestUserEmailDomain: string = "example.com"; // Guest users will be identified by their email addresses belonging to this domain

  constructor(public http: HttpClient, private translate: TranslateService) { }

  get userUpdated(): Observable<User> {
    return this._userUpdated.asObservable();
  }

  get userSignedOut(): Observable<any> {
    return this._userSignedOut.asObservable();
  }

  // Pulls the current session from local storage
  session(): Session {
    return (JSON.parse(localStorage.session || "{}") as Session);
  }

  // Pulls the user object out of the session
  user(): User {
    return this.session().user as User;
  }

  // Gets the user's preferred locale
  preferredLocale(): string {
    return (this.user() || {})["preferred_locale"]
  }

  // Sets the local storage session variable to the passed object
  setSession(session: Session): void {
    localStorage.setItem('session', JSON.stringify(session));
  }

  // Returns true/false if user is signed in (guest or registered)
  // If optional User param, checks if that particular user is signed in
  isSignedIn(user?: User): Boolean {
    let session = this.session();
    if(user) {
      return !!(session && session.email && session.email === user.email);
    } else {
      return !!(session && session.email);
    }
  }

  // Returns true/false if email address matches guest email addresses
  isGuestEmail(email: string): Boolean {
    return email.search(this.guestUserEmailDomain) >= 0;
  }

  // Returns true/false if user is signed in and is a registered user
  isRegisteredUser(): Boolean {
    return this.isSignedIn() && !this.isGuestEmail(this.session().email);
  }

  // Returns true/false if user is signed in and is a guest user
  isGuestUser(): Boolean {
    return this.isSignedIn() && this.isGuestEmail(this.session().email);
  }

  // Returns the email address if the user is signed in, otherwise return an empty string
  presentableEmail(): string {
    if(this.isRegisteredUser())
      return this.session().email;
    else
      return '';
  }

  // Constructs a hash of necessary Auth Headers for communicating with OneClick
  authHeaders(): HttpHeaders {
    if(this.isRegisteredUser()) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'X-User-Email': this.session().email,
        'X-User-Token': this.session().authentication_token
      });
    } else if(this.isGuestUser()) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'X-User-Email': this.session().email
      });
    } else {
      return this.defaultHeaders;
    }
  }

  //creates a new user
  signUp(email_address: string, password: string, password_confirmation: string, paratransit_id:string, county:string): Observable<Response> {
    let uri: string = encodeURI(this.baseUrl + 'sign_up');
    let body = JSON.stringify({user: { email: email_address, password:  password, password_confirmation: password_confirmation, paratransit_id: paratransit_id, county: county }});
    let options = {
      headers: this.defaultHeaders
    };

    return this.http
      .post(uri, body, options).pipe(
        map((response : any) => {

        // Pull the session hash (user email and auth token) out of the response
        let data = response.data;
        let session = data.session || {};

        // Store session info in local storage to keep user logged in
        if(session.email && session.authentication_token) {
          this.setSession(session);
        }

        return response;
      }));


  }


  // Signs in a user via email and password, storing their token to local storage
  signIn(email: string, password: string): Observable<Response> {
    let uri: string = encodeURI(this.baseUrl + 'sign_in');
    let body = JSON.stringify({user: { email: email, password: password }});
    let options = {
      headers: this.defaultHeaders
    };

    return this.http
        .post(uri, body, options).pipe(
        map((response: any) => {
          // Pull the session hash (user email and auth token) out of the response
          let data = response.data;
          let session = data.session || {};

          // Store session info in local storage to keep user logged in
          if(session.email && session.authentication_token) {
            this.setSession(session);
          }

          return response;
        }));
  }

  // Removes session from local storage and tells backend to reset the user's token
  signOut(): Observable<Response> {

    // If signed in, remove the item from local storage and make sign out call
    if(this.isSignedIn()) {
      let uri: string = encodeURI(this.baseUrl + 'sign_out');
      let options = {
        headers: this.authHeaders()
      };

      localStorage.removeItem('session');
      this._userSignedOut.next(new Subject<any>());

      return this.http
          .delete(uri, options).pipe(
          map((response: Response) => {
            return response;
          }));
    } else { // If not signed in, return an empty observable
      return scheduled([null],asyncScheduler);
    }
  }

  // Resets the password of the provided user (only email required)
  resetPassword(email: string): Observable<Response>{
    let uri: string = encodeURI(this.baseUrl + 'users/reset_password');
    let body = JSON.stringify({user: { email: email }});
    let options = {
      headers: this.defaultHeaders
    };

    return this.http
        .post(uri, body, options).pipe(
        map((response: Response) => {
          return response;
        }));
  }

  // Resets the password of the provided user (only email required)
  resendEmailConfirmation(email: string): Observable<Response>{
    let uri: string = encodeURI(this.baseUrl + 'users/resend_email_confirmation');
    let body = JSON.stringify({user: { email: email }});
    let options = {
      headers: this.defaultHeaders
    };

    return this.http
      .post(uri, body, options).pipe(
      map((response: Response) => {
        return response;
      }));
  }

  // Pulls the user location out of the session if available
  userLocation(): GooglePlaceModel {
    return new GooglePlaceModel(
      this.session().user_starting_location ||
      { geometry: { location: appConfig.DEFAULT_LOCATION } }
    );
  }

  // Pulls out the user's recent places from the session, if available
  recentPlaces(): GooglePlaceModel[] {
    return (this.session().recent_places || []) as GooglePlaceModel[];
  }

  // Sets the recent places array to a new array of google places
  setRecentPlaces(places: GooglePlaceModel[]): GooglePlaceModel[] {
    let session = this.session();
    session.recent_places = places.slice(0, this.recentPlacesLength); // Limit the list to X places
    this.setSession(session);
    return this.recentPlaces();
  }

  // Adds a single recent place to the array of recent places, at the top of the list
  addRecentPlace(place: GooglePlaceModel): GooglePlaceModel[] {
    let recentPlaces = this.recentPlaces();
    recentPlaces.unshift(place); // Insert the new place at the top of the list.
    return this.setRecentPlaces(recentPlaces);
  }

  // Updates the session based on a user object, and updates the locale
  updateSessionUser(user: User): User {
    let session = this.session();
    session.email = user.email;
    session.user = user;
    this.setSession(session);
    this._userUpdated.next(user);// Publish user updated event for pages to listen to
    return this.user();
  }

  // Sets the preferred locale, regardless of whether or not user is logged in
  setPreferredLocale(locale: string): User {
    let user = (this.user() || {}) as User;
    user["preferred_locale"] = locale;
    return this.updateSessionUser(user);
  }

  // Pulls the find_services_history_id out of the session
  findServicesHistoryId(): number {
    return this.session().find_services_history_id as number;
  }

  setFindServicesHistoryId(find_services_history_id: number): void {
    let session = this.session();
    session.find_services_history_id = find_services_history_id;
    this.setSession(session);
  }

  unsetFindServicesHistoryId(): void {
    this.setFindServicesHistoryId(0);
  }

  handleSignUpErrors(httpErr): string[] {
    let errors: string[] = [];
    errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.default"));

    if (httpErr.error.data) {
      if(httpErr.error.data.errors.email == 'is invalid')
      {
        errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.email_bad"));
      }
      if(httpErr.error.data.errors.email == 'has already been taken')
      {
        errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.email_used"));
      }
      if(httpErr.error.data.errors.email == 'is too short (minimum is 6 characters)')
      {
        errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.password_bad"));
      }
      if(httpErr.error.data.errors.password == "must include at least one letter and one digit")
      {
        errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.password_not_complex"));
      }
      if(httpErr.error.data.errors.email == "can't be blank")
      {
        errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.email_cant_be_blank"));
      }
      if(httpErr.error.data.errors.password == "can't be blank")
      {
        errors.push(this.translate.instant("oneclick.pages.sign_up.error_messages.password_cant_be_blank"));
      }
    }
    return errors;
  }

}
