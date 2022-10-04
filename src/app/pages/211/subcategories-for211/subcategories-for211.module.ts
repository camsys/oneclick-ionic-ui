import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriesFor211PageRoutingModule } from './subcategories-for211-routing.module';

import { SubcategoriesFor211Page } from './subcategories-for211.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcategoriesFor211PageRoutingModule
  ],
  declarations: [SubcategoriesFor211Page]
})
export class SubcategoriesFor211PageModule {}
