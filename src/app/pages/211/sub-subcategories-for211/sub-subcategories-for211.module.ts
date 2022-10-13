import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubSubcategoriesFor211PageRoutingModule } from './sub-subcategories-for211-routing.module';

import { SubSubcategoriesFor211Page } from './sub-subcategories-for211.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    SubSubcategoriesFor211PageRoutingModule
  ],
  declarations: [SubSubcategoriesFor211Page]
})
export class SubSubcategoriesFor211PageModule {}
