import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailItineraryModalPageRoutingModule } from './email-itinerary-modal-routing.module';

import { EmailItineraryModalPage } from './email-itinerary-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailItineraryModalPageRoutingModule
  ],
  declarations: [EmailItineraryModalPage]
})
export class EmailItineraryModalPageModule {}
