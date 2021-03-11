import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailItineraryModalPage } from './email-itinerary-modal';

@NgModule({
  declarations: [
    EmailItineraryModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailItineraryModalPage),
  ],
})
export class EmailItineraryModalPageModule {}
