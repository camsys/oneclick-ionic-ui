import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripResponsePageRoutingModule } from './trip-response-routing.module';

import { TripResponsePage } from './trip-response.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripResponsePageRoutingModule
  ],
  declarations: [TripResponsePage]
})
export class TripResponsePageModule {}
