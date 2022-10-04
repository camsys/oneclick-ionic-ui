import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectionsMapTabPageRoutingModule } from './directions-map-tab-routing.module';

import { DirectionsMapTabPage } from './directions-map-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectionsMapTabPageRoutingModule
  ],
  declarations: [DirectionsMapTabPage]
})
export class DirectionsMapTabPageModule {}
