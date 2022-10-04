import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesFor211PageRoutingModule } from './categories-for211-routing.module';

import { CategoriesFor211Page } from './categories-for211.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesFor211PageRoutingModule
  ],
  declarations: [CategoriesFor211Page]
})
export class CategoriesFor211PageModule {}
