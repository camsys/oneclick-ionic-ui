import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailItineraryModalPageRoutingModule } from './email-itinerary-modal-routing.module';

import { EmailItineraryModalPage } from './email-itinerary-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    EmailItineraryModalPageRoutingModule
  ],
  declarations: [EmailItineraryModalPage]
})
export class EmailItineraryModalPageModule {}
