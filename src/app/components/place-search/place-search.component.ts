import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { GooglePlaceModel } from 'src/app/models/google-place';
import { SearchResultModel } from 'src/app/models/search-result';
import { GeocodeService } from 'src/app/services/google/geocode.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-place-search',
  templateUrl: './place-search.component.html',
  styleUrls: ['./place-search.component.scss'],
})
export class PlaceSearchComponent implements OnInit {

  query: string;
  searchControl: FormControl;
  @Input() placeholder: string;
  autocompleteItems: SearchResultModel[];
  googleAutocompleteItems: SearchResultModel[];
  oneClickAutocompleteItems: SearchResultModel[];
  place: GooglePlaceModel;

  @Output() onArrowDown: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect: EventEmitter<GooglePlaceModel> = new EventEmitter<GooglePlaceModel>();

  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if(event.code === "ArrowDown") {
      this.onArrowDown.emit();
    }
  }

  constructor(public geoServiceProvider: GeocodeService,
              public oneClickProvider: OneClickService,
              public events: Events,
              public toastCtrl: ToastController,
              private translate: TranslateService,
              public changeDetector: ChangeDetectorRef) {
    this.query = '';
    this.searchControl = new FormControl;
    this.placeholder = this.placeholder || "Search";
    this.googleAutocompleteItems = [];
    this.oneClickAutocompleteItems = [];
    this.autocompleteItems = [];
    this.place = null;

    this.searchControl.valueChanges.pipe(debounceTime(500))
                      .subscribe((query) => {
      this.updateAddressSearch(query);
    });
  }


  ngOnInit() {}

  // Updates the search items list based on the response from OneClick and Google
  updateAddressSearch(query) {

    // Only get 1-Click places if a query is present.
    if(query && query.length > 0) {
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
    if(query && query.length > 0) {
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
    this.events.publish('place-search:change');
  }

  // Empties the search results array
  clear() {
    this.autocompleteItems = [];
  }

  // Sets the place value and fills in the search bar, but doesn't run it as a query
  // Hides the spinner, clears the search results, and emits the onSelect output event.
  setPlace(place: GooglePlaceModel) {
    this.place = place;
    this.searchControl.setValue(this.place.name || this.place.formatted_address, {emitEvent: false});
    this.clear(); // Clear the autocomplete results
    this.events.publish('spinner:hide'); // Hide spinner once places are returned
    this.onSelect.emit(this.place); // Emit the onSelect output event
  }

  // Select an item from the search results list
  chooseItem(item: any, viewType: string) {
    this.events.publish('spinner:show'); // Show spinner until geocoding call returns

    // If the item already has a lat/lng, save it as the selected place.
    if(item && item.result && new GooglePlaceModel(item.result).isGeocoded()) {
      this.setPlace(item.result);
    } else { // Otherwise, geocode the selected place and then save it.
      this.geoServiceProvider.getPlaceFromFormattedAddress(item.result)
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
          let toast = this.toastCtrl.create({
            message: this.translate.instant('find_services_out_of_area_message'),
            position: 'bottom',
            duration: 3000
          });
          toast.present();
        }
    } else {
      if (this.geoServiceProvider.isZipcodeOutOfAreaForTransportation(place)) {
          let toast = this.toastCtrl.create({
            message: this.translate.instant('find_transportation_out_of_area_message'),
            position: 'bottom',
            duration: 3000
          });
          toast.present();
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

  // Pass through the ion-search focus and blur events
  ionFocus() {
    this.onFocus.emit();
  }
  ionBlur() {
    this.onBlur.emit();
  }


}
