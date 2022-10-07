import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SubSubcategoryFor211Model } from 'src/app/models/sub-subcategory-for-211';
import { SubcategoryFor211Model } from 'src/app/models/subcategory-for-211';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-sub-subcategories-for211',
  templateUrl: './sub-subcategories-for211.page.html',
  styleUrls: ['./sub-subcategories-for211.page.scss'],
})
export class SubSubcategoriesFor211Page implements OnInit {

  code: string;
  subcategory: SubcategoryFor211Model;
  subSubCategories: SubSubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClick: OneClickService,
              public events: Events,
              private auth: AuthService,
              public platform: Platform) {
                
    this.code = this.navParams.data.code;
    
    // Wait for platform to be ready so proper language is set
    this.platform.ready().then(() => {
      
      // Fetch the subcategories based on the passed category code
      this.getSubSubCategories(this.code);
      
      // If subcategory object is passed, set it as the subcategory
      if(this.navParams.data.subcategory) {
        this.subcategory = this.navParams.data.subcategory as SubcategoryFor211Model;
      } else if(this.code) { // Otherwise, get subcategory details based on the code
        this.oneClick.getSubCategoryByCode(this.code)
            .subscribe(subcat => this.subcategory = subcat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.setRoot(HelpMeFindPage);
      }
      
    })
  }

  ngOnInit() {
  }

  getSubSubCategories(code: string): void {
    let userLocation = this.auth.userLocation();
    this.oneClick
        .getSubSubcategoryForSubcategoryName(code, userLocation.lat(), userLocation.lng())
        .then(sscs => this.subSubCategories = sscs);
  }

  openToServices(subSubCategory: SubSubcategoryFor211Model) {
    this.navCtrl.push(ServicesPage, { sub_sub_category: subSubCategory, code: subSubCategory.code });
  }


}
