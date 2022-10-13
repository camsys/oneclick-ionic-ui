import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesMapTabPageRoutingModule } from './services-map-tab-routing.module';

import { ServicesMapTabPage } from './services-map-tab.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ServicesMapTabPageRoutingModule
  ],
  declarations: [ServicesMapTabPage]
})
export class ServicesMapTabPageModule {}
