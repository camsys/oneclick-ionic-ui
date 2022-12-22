import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailItineraryModalPage } from './email-itinerary-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EmailItineraryModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailItineraryModalPageRoutingModule {}
