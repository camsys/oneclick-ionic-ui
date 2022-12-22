import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubSubcategoryFor211Model } from 'src/app/models/sub-subcategory-for-211';
import { SubcategoryFor211Model } from 'src/app/models/subcategory-for-211';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { HelpMeFindPage } from '../../help-me-find/help-me-find.page';
import { ServicesPage } from '../services/services.page';

@Component({
  selector: 'app-sub-subcategories-for211',
  templateUrl: './sub-subcategories-for211.page.html',
  styleUrls: ['./sub-subcategories-for211.page.scss'],
})
export class SubSubcategoriesFor211Page implements OnInit {
  static routePath:string = '/sub_sub_categories';

  code: string;
  subcategory: SubcategoryFor211Model;
  subSubCategories: SubSubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              private route:ActivatedRoute,
              private router:Router,
              private oneClick: OneClickService,
              private auth: AuthService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.code = params.get('code'); 

      // Fetch the subcategories based on the passed category code
      this.getSubSubCategories(this.code);

      if (this.router.getCurrentNavigation().extras.state &&
          this.router.getCurrentNavigation().extras.state.subcategory) {

        this.subcategory = this.router.getCurrentNavigation().extras.state.subcategory as SubcategoryFor211Model;
      } else if (this.code) { // Otherwise, get subcategory details based on the code
        this.oneClick.getSubCategoryByCode(this.code)
            .subscribe(subcat => this.subcategory = subcat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.navigateRoot(HelpMeFindPage.routePath);
      }
    });
  }

  getSubSubCategories(code: string): void {
    let userLocation = this.auth.userLocation();
    this.oneClick
        .getSubSubcategoryForSubcategoryName(code, userLocation.lat(), userLocation.lng())
        .then(sscs => this.subSubCategories = sscs);
  }

  openToServices(subSubCategory: SubSubcategoryFor211Model) {
    this.router.navigate([ServicesPage.routePath, subSubCategory.code], { 
      state: {
        sub_sub_category: subSubCategory  
      }
    });
  }


}
