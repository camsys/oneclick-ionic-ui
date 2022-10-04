import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubSubcategoriesFor211PageRoutingModule } from './sub-subcategories-for211-routing.module';

import { SubSubcategoriesFor211Page } from './sub-subcategories-for211.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubSubcategoriesFor211PageRoutingModule
  ],
  declarations: [SubSubcategoriesFor211Page]
})
export class SubSubcategoriesFor211PageModule {}
