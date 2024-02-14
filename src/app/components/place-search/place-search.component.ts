import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { SearchResultModel } from 'src/app/models/search-result';
import { GeocodeService } from 'src/app/services/google/geocode.service';
import { LoaderService } from 'src/app/services/loader.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { appConfig } from 'src/environments/appConfig';

@Component({
  selector: 'place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.scss'],
})
export class PlaceSearchComponent implements OnInit {

  query: string;
  @Input() ariaClearLabel: string;
  @Input() uniqueLabelId: string;
  @Input() placeholder: string;
  @Input() resultsListId: string;
  @Input() isInvalid: boolean;
  autocompleteItems: SearchResultModel[];
  googleAutocompleteItems: SearchResultModel[];
  oneClickAutocompleteItems: SearchResultModel[];
  place: GooglePlaceModel;
  hasFocus:boolean = false;
  activeResultId: string = "";
  resultsExpanded: boolean = false;
  ignoreBlur: boolean = false;

  searchControl:FormControl = new FormControl();

  @Output() onArrowDown: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect: EventEmitter<GooglePlaceModel> = new EventEmitter<GooglePlaceModel>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('keydown', ['$event'])
  keyboardInputArrowDown(event: KeyboardEvent) {
    if(event.code === "ArrowDown") {
      this.onArrowDown.emit();
    }
  }

  //need to catch mouse downs in the autocomplete results so use window:mousedown instead of just mousedown
  @HostListener('window:mousedown', ['$event'])
  keyboardInputMouseDown(event: KeyboardEvent) {
    if (this.hasFocus) {//if control has focus, it isn't really losing it (it's a click in the autocomplete results)
      this.ignoreBlur = true;
    } //else ignore all mouse downs when this control is not in focus
  }

  constructor(public geoServiceProvider: GeocodeService,
              public oneClickProvider: OneClickService,
              public toastCtrl: ToastController,
              private translate: TranslateService,
              public changeDetector: ChangeDetectorRef,
              private loader: LoaderService) {
    this.query = '';
    this.placeholder = this.placeholder ? this.placeholder : "";
    this.googleAutocompleteItems = [];
    this.oneClickAutocompleteItems = [];
    this.autocompleteItems = [];
    this.place = null;
  }


  ngOnInit() {

    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(
      query => {
        this.updateAddressSearch(query);
        if (query && query.length > 0)
          this.resultsExpanded = true;
        else this.resultsExpanded = false;
      }
    );
  }

  // handleSearchChange(event) {
  //   const query = event.target.value;
  //   this.updateAddressSearch(query);
  // }

  // Updates the search items list based on the response from OneClick and Google
  updateAddressSearch(query) {

    // Only get 1-Click places if a query is present.
    if(query && query.trim().length > 0) {
      this.oneClickProvider
      .getPlaces(query)
      .subscribe(places => {
        // Set oneClickAutocompleteItems to the places call results and refresh the search results
        this.oneClickAutocompleteItems = places.map((p) => this.convertPlaceToSearchResult(p));
        this.refresh();
      });
    } else {
      this.oneClickAutocompleteItems = [];
      this.refresh();
    }

    // Only get google places if a query is present.
    if(query && query.trim().length > 0) {
      this.geoServiceProvider
      .getGooglePlaces(query)
      .subscribe(places => {
        // Set googleAutocompleteItems to the places call results and refresh the search results
        this.googleAutocompleteItems = places.map((p) => this.convertPlaceToSearchResult(p));
        this.refresh();
      });
    } else {
      this.googleAutocompleteItems = [];
      this.refresh();
    }


  }

  // Refreshes the search results from the combined Google and OneClick search results,
  private refresh() {
    // Set autocomplete results to the combination of the google and oneclick place searches
    this.autocompleteItems = this.oneClickAutocompleteItems.concat(this.googleAutocompleteItems);
    this.onChange.emit();
  }

  // Empties the search results array
  clear() {
    this.searchControl.setValue(" ");
    this.clearAutocomplete();
    this.place = null;
    this.isInvalid = true;
  }

  clearAutocomplete() {
    this.autocompleteItems = [];
  }

  // Sets the place value and fills in the search bar, but doesn't run it as a query
  // Hides the spinner, clears the search results, and emits the onSelect output event.
  setPlace(place: GooglePlaceModel) {
    this.place = place;
    this.query = this.place.name || this.place.formatted_address;
    this.clearAutocomplete(); // Clear the autocomplete results
    this.loader.hideLoader();// Hide spinner once places are returned
    this.onSelect.emit(this.place); // Emit the onSelect output event
  }

  // Select an item from the search results list
  chooseItem(item: any, viewType: string) {
    this.loader.showLoader(); // Show spinner until geocoding call returns

    // If the item already has a lat/lng, save it as the selected place.
    if(item && item.result && new GooglePlaceModel(item.result).isGeocoded()) {
      this.setPlace(new GooglePlaceModel(item.result));
    } else { // Otherwise, geocode the selected place and then save it.
      this.geoServiceProvider.getPlaceFromFormattedAddress(new GooglePlaceModel(item.result))
      .subscribe((places) => {
        this.setPlace(places[0]); // Set the component's place variable to the first result
        this.checkIfZipcodeOutOfArea(places[0], viewType);
      });
    }
  }

  // Check if the Google place's zipcode is within the service area of Find Services or Transportation workflow.
  private checkIfZipcodeOutOfArea(place: GooglePlaceModel, viewType: string) : void {
    if (viewType == 'services') {
        if (this.geoServiceProvider.isZipcodeOutOfAreaForServices(place)) {
          this.toastCtrl.create({
            message: this.translate.instant('find_services_out_of_area_message'),
            position: 'bottom',
            duration: 3000
          }).then(toast => toast.present());
        }
    } else {
      if (this.geoServiceProvider.isZipcodeOutOfAreaForTransportation(place)) {
          this.toastCtrl.create({
            message: this.translate.instant('find_transportation_out_of_area_message'),
            position: 'bottom',
            duration: 3000
          }).then(toast => toast.present());
      }
    }
  }

  // Converts a google place model to an autocomplete item model
  convertPlaceToSearchResult(place: GooglePlaceModel): SearchResultModel {
    return {
      title: place.name,
      label: place.formatted_address,
      result: place
    } as SearchResultModel;
  }

  changeAriaFocusItem(idInFocus:string) {
    this.activeResultId = idInFocus;
  }

  // Pass through the focus and blur events
  ionFocus() {
    this.hasFocus = true;
    if (this.searchControl.value && this.searchControl.value.length > 0)
      this.resultsExpanded = true;
    else this.resultsExpanded = false;
    this.onFocus.emit();
  }

  ionBlur() {
    this.hasFocus = false;
    this.resultsExpanded = false;
    if (!this.ignoreBlur) {
      this.onBlur.emit();
    }
    else {//don't ignore twice
      this.ignoreBlur = false;
    }
  }

}
