import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailItineraryModalPageRoutingModule } from './email-itinerary-modal-routing.module';

import { EmailItineraryModalPage } from './email-itinerary-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    EmailItineraryModalPageRoutingModule
  ],
  declarations: [EmailItineraryModalPage]
})
export class EmailItineraryModalPageModule {}
