import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ServiceModel } from 'src/app/models/service';
import { SubSubcategoryFor211Model } from 'src/app/models/sub-subcategory-for-211';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  code: string;

  subSubCategory: SubSubcategoryFor211Model;
  services: ServiceModel[] = [];

  servicesParams: any;

  mapTab: any;
  listTab: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private auth: AuthService,
              private oneClick: OneClickService,
              public platform: Platform) {
    this.mapTab = ServicesMapTabPage;
    this.listTab = ServicesListTabPage;
    this.code = this.navParams.data.code;

    // Wait for platform to be ready so proper language is set
    this.platform.ready().then(() => {

      // If subsubcategory object is passed, set it as the subsubcategory
      if(this.navParams.data.sub_sub_category) {
        this.subSubCategory = this.navParams.data.sub_sub_category as SubSubcategoryFor211Model;
      } else if(this.code) { // Otherwise, get subsubcategory details based on the code
        this.oneClick.getSubSubCategoryByCode(this.code)
            .subscribe(subsubcat => this.subSubCategory = subsubcat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.setRoot(HelpMeFindPage);
      }

    })
  }

  ngOnInit() {
    this.events.publish('spinner:show'); // Show spinner while results are loading
    let userLocation = this.auth.userLocation();

    this.oneClick
    .getServicesFromSubSubCategoryName(this.code, userLocation.lat(), userLocation.lng())
    .then((svcs) => {
      this.events.publish('spinner:hide'); // Hide spinner once results come back
      this.services = svcs;
      this.servicesParams = {services: this.services, service_count: this.subSubCategory.service_count}
    });
  }

  ionViewWillEnter() {
    // Watch for service:selected events from child tabs
    this.events.subscribe('service:selected', (service) => {
      this.onServiceSelected(service);
    })
  }

  ionViewWillLeave() {
    // on leaving the page, unsubscribe from the service:selected event to avoid
    // destroyed view errors
    this.events.unsubscribe('service:selected');
  }

  // When a service selected event is fired in one of the child tabs,
  // open the transportation options page, passing along the service, an origin, and a destination
  onServiceSelected(service: ServiceModel) {

    // Insert the new page underneat the tabs pages, and then pop the tabs pages off the stack
    this.navCtrl.insert(this.navCtrl.length() - 1, ServiceFor211DetailPage, {
      service: service,
      origin: this.auth.userLocation(),
      destination: {
        name: service.site_name,
        geometry: { location: { lat: service.lat, lng: service.lng} }
      }
    })
    .then(() => this.navCtrl.pop());
  }

}
