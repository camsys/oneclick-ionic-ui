import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesFor211PageRoutingModule } from './categories-for211-routing.module';

import { CategoriesFor211Page } from './categories-for211.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    CategoriesFor211PageRoutingModule
  ],
  declarations: [CategoriesFor211Page]
})
export class CategoriesFor211PageModule {}
