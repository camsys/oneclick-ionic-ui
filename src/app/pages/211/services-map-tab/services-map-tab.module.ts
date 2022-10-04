import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesMapTabPageRoutingModule } from './services-map-tab-routing.module';

import { ServicesMapTabPage } from './services-map-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesMapTabPageRoutingModule
  ],
  declarations: [ServicesMapTabPage]
})
export class ServicesMapTabPageModule {}
