import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CategoryFor211Model } from 'src/app/models/category-for-211';
import { SubcategoryFor211Model } from 'src/app/models/subcategory-for-211';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-subcategories-for211',
  templateUrl: './subcategories-for211.page.html',
  styleUrls: ['./subcategories-for211.page.scss'],
})
export class SubcategoriesFor211Page implements OnInit {

  code: string;
  category: CategoryFor211Model;
  subcategories: SubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private oneClick: OneClickService,
              private auth: AuthService,
              public platform: Platform) {
    this.code = this.navParams.data.code;
    
    // Wait for platform to be ready so proper language is set
    this.platform.ready().then(() => {
      
      // Fetch the subcategories based on the passed category code
      this.getSubcategories(this.code);
      
      // If category object is passed, set it as the category
      if(this.navParams.data.category) {
        this.category = this.navParams.data.category as CategoryFor211Model;
      } else if(this.code) { // Otherwise, get category details based on the code
        this.oneClick.getCategoryByCode(this.code)
            .subscribe(cat => this.category = cat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.setRoot(HelpMeFindPage);
      }
      
    })
  }

  ngOnInit() {
  }

  getSubcategories(code: string): void {
    let userLocation = this.auth.userLocation();
    this.oneClick
        .getSubcategoryForCategoryName(code, userLocation.lat(), userLocation.lng())
        .then(subcategories => this.subcategories = subcategories);
  }

  openToSubSubCategories(subcategory: SubcategoryFor211Model){
    this.navCtrl.push(SubSubcategoriesFor211Page, { sub_category: subcategory, code: subcategory.code } );
  }


}
