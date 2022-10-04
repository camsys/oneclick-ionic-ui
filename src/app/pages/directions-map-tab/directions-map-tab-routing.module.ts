import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectionsMapTabPage } from './directions-map-tab.page';

const routes: Routes = [
  {
    path: '',
    component: DirectionsMapTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectionsMapTabPageRoutingModule {}
