import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { CategoryFor211Model } from 'src/app/models/category-for-211';
import { SubcategoryFor211Model } from 'src/app/models/subcategory-for-211';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { HelpMeFindPage } from '../../help-me-find/help-me-find.page';
import { SubSubcategoriesFor211Page } from '../sub-subcategories-for211/sub-subcategories-for211.page';

@Component({
  selector: 'app-subcategories-for211',
  templateUrl: './subcategories-for211.page.html',
  styleUrls: ['./subcategories-for211.page.scss'],
})
export class SubcategoriesFor211Page implements OnInit {
  static routePath:string = '/sub_categories';

  code: string;
  category: CategoryFor211Model;
  subcategories: SubcategoryFor211Model[];

  constructor(public navCtrl: NavController,
              private router: Router,
              private route: ActivatedRoute,
              private oneClick: OneClickService,
              private auth: AuthService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.code = params.get('code');

      // Fetch the subcategories based on the passed category code
      this.getSubcategories(this.code);

      if (this.router.getCurrentNavigation().extras.state &&
          this.router.getCurrentNavigation().extras.state.category) {

        this.category = this.router.getCurrentNavigation().extras.state.category as CategoryFor211Model;
      }
      else if (this.code) { // Otherwise, get category details based on the code
        this.oneClick.getCategoryByCode(this.code)
            .subscribe(cat => this.category = cat);
      } else { // Or, if necessary nav params not passed, go home.
        this.navCtrl.navigateRoot('/');
      }
    });
  }

  getSubcategories(code: string): void {
    let userLocation = this.auth.userLocation();
    this.oneClick
        .getSubcategoryForCategoryName(code, userLocation.lat(), userLocation.lng())
        .then(subcategories => this.subcategories = subcategories);
  }

  openToSubSubCategories(subcategory: SubcategoryFor211Model){
    this.router.navigate([SubSubcategoriesFor211Page.routePath, subcategory.code], { 
      state: {
        sub_category: subcategory 
      }
    } );
  }


}
