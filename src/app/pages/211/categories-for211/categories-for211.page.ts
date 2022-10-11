import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { AutocompleteResultsComponent } from 'src/app/components/autocomplete-results/autocomplete-results.component';
import { CategoryFor211Model } from 'src/app/models/category-for-211';
import { SearchResultModel } from 'src/app/models/search-result';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { ServiceFor211DetailPage } from '../service-for211-detail/service-for211-detail.page';
import { ServicesPage } from '../services/services.page';
import { SubSubcategoriesFor211Page } from '../sub-subcategories-for211/sub-subcategories-for211.page';
import { SubcategoriesFor211Page } from '../subcategories-for211/subcategories-for211.page';

@Component({
  selector: 'app-categories-for211',
  templateUrl: './categories-for211.page.html',
  styleUrls: ['./categories-for211.page.scss'],
})
export class CategoriesFor211Page implements OnInit {
  static routePath: string = '/categories';

  @ViewChild('searchResultsList') searchResultsList: AutocompleteResultsComponent;
  
  categories: CategoryFor211Model[];
  searchControl: FormControl;
  searchResults: SearchResultModel[];
  
  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if(event.code === "ArrowDown") {
      this.searchResultsList.focus(); // Focus on search results list when you arrow down from the input field
    }
  }

  constructor(//public navCtrl: NavController,
              private router: Router,
              private oneClickProvider: OneClickService,
              private auth: AuthService,
              private changeDetector: ChangeDetectorRef,
              private translate: TranslateService) {
    
    this.searchResults = [];
    this.searchControl = new FormControl;
    this.searchControl.valueChanges.pipe(debounceTime(500))
                      .subscribe((query) => {
      this.updateKeywordSearch(query);
    });              
  }

  getCategories(): void {
    let userLocation = this.auth.userLocation();
    this.oneClickProvider
        .getCategoriesFor211Services(userLocation.lat(), userLocation.lng())
        .then(categories => this.categories = categories);
  }
  
  ngOnDestroy() {
    this.changeDetector.detach();
  }

  ngOnInit() {
    this.getCategories();
  }

  openToSubcategory(category: CategoryFor211Model){
    this.router.navigate([SubcategoriesFor211Page.routePath], { 
      state: { 
        category: category, 
        code: category.code }
    } );
  }
  
  // Updates the search results based on a query string.
  updateKeywordSearch(query: string) {
    if(query) {
      this.oneClickProvider.refernetKeywordSearch(query)
          .subscribe((results) => {
            this.searchResults = results.map((r) => this.translateSearchResult(r));
            if(this.searchResults.length === 0) {
              this.searchResults = [ this.emptySearchResult() ];
            }
            this.changeDetector.markForCheck();
          });
    } else { // If query is empty, clear the results.
      this.searchResults = [];
      this.changeDetector.markForCheck();
    }
  }
  
  // Go to the appropriate page based on the type of the result
  goToSearchResult(result: SearchResultModel) {
    switch(result.type) {
      case "OneclickRefernet::Category":
        this.router.navigate([SubcategoriesFor211Page.routePath, JSON.stringify(result.result)]);
        break;
      case "OneclickRefernet::SubCategory":
        this.router.navigate([SubSubcategoriesFor211Page.routePath, JSON.stringify(result.result)]);
        break;
      case "OneclickRefernet::SubSubCategory":
        let ssc = result.result;
        // let userLocation = this.auth.userLocation();
        this.router.navigate([ServicesPage.routePath, JSON.stringify(result.result)]);

        // this.events.publish('spinner:show'); // Show spinner while results are loading


        // this.oneClickProvider
        // .getServicesFromSubSubCategoryName(ssc.code, userLocation.lat(), userLocation.lng())
        // .then((value) => {
        //   this.events.publish('spinner:hide'); // Hide spinner once results come back
        //   this.navCtrl.push(ServicesPage, ssc);
        //   }
        // );
        break;
      case "OneclickRefernet::Service":
        let service = result.result;
        // service.url = null;
      
        this.router.navigate([ServiceFor211DetailPage.routePath], {
          state : {
            service: service,
            origin: this.auth.userLocation(),
            destination: {
              name: service.site_name,
              geometry: { location: { lat: service.lat, lng: service.lng } }
            }
          }
        });
        break;
      default:
        // If result can't link to a page, just clear the results
        this.searchResults = [];
        this.changeDetector.markForCheck();
    }
  }
  
  // Returns the appropriate translation key for OneClick Refernet model class names
  translationKeyFor(name: string) {
    return {
      "OneclickRefernet::Category": "category",
      "OneclickRefernet::SubCategory": "sub_category",
      "OneclickRefernet::SubSubCategory": "sub_sub_category",
      "OneclickRefernet::Service": "service"
    }[name];
  }
  
  // Builds a translated title for a search result
  translateSearchResult(result: SearchResultModel): SearchResultModel {
    let tkey = "oneclick.pages.categories.resources_search." + this.translationKeyFor(result.type);
    result.title = this.translate.instant(tkey);
    return result;
  }
  
  // Returns a translated message for empty search results
  emptySearchResult(): SearchResultModel {
    return { label: this.translate.instant('oneclick.pages.categories.resources_search.empty_search_result') } as SearchResultModel;
  }


}
