import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ServiceModel } from 'src/app/models/service';
import { SubSubcategoryFor211Model } from 'src/app/models/sub-subcategory-for-211';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { ServicesParamsService } from 'src/app/services/services-params.service';
import { HelpMeFindPage } from '../../help-me-find/help-me-find.page';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  static routePath:string = "/services";

  code: string;

  subSubCategory: SubSubcategoryFor211Model;
  services: ServiceModel[] = [];


  constructor(public navCtrl: NavController,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private oneClick: OneClickService,
              private loader: LoaderService,
              private servicesParamsService: ServicesParamsService) {
                
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.code = params.get('code');
      
      if (this.router.getCurrentNavigation().extras.state &&
          this.router.getCurrentNavigation().extras.state.sub_sub_category) {
        
        this.subSubCategory = this.router.getCurrentNavigation().extras.state.sub_sub_category as SubSubcategoryFor211Model;
      
      } else if (this.code) { // Otherwise, get subsubcategory details based on the code
        
        this.oneClick.getSubSubCategoryByCode(this.code)
            .subscribe(subsubcat => this.subSubCategory = subsubcat);

      } else { // Or, if necessary nav params not passed, go home.
        
        this.navCtrl.navigateRoot('/');
      }

      this.loader.showLoader();// Show spinner while results are loading
      let userLocation = this.auth.userLocation();

      this.oneClick.getServicesFromSubSubCategoryName(this.code, userLocation.lat(), userLocation.lng())
        .then((svcs) => {
          this.loader.hideLoader();// Hide spinner once results come back
          this.services = svcs;
          
          //update for tabs
          this.servicesParamsService.setParams(this.services, this.subSubCategory.service_count);
        });
    });
  }

  // ionViewWillEnter() {
  //   // Watch for service:selected events from child tabs
  //   this.events.subscribe('service:selected', (service) => {
  //     this.onServiceSelected(service);
  //   })
  // }

  // ionViewWillLeave() {
  //   // on leaving the page, unsubscribe from the service:selected event to avoid
  //   // destroyed view errors
  //   this.events.unsubscribe('service:selected');
  // }

  // When a service selected event is fired in one of the child tabs,
  // open the transportation options page, passing along the service, an origin, and a destination
  // onServiceSelected(service: ServiceModel) {

  //   // Insert the new page underneat the tabs pages, and then pop the tabs pages off the stack
  //   this.navCtrl.insert(this.navCtrl.length() - 1, ServiceFor211DetailPage, {
  //     service: service,
  //     origin: this.auth.userLocation(),
  //     destination: {
  //       name: service.site_name,
  //       geometry: { location: { lat: service.lat, lng: service.lng} }
  //     }
  //   })
  //   .then(() => this.navCtrl.pop());
  // }

}
