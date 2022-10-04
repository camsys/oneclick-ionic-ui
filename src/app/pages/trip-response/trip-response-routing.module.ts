import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripResponsePage } from './trip-response.page';

const routes: Routes = [
  {
    path: '',
    component: TripResponsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripResponsePageRoutingModule {}
