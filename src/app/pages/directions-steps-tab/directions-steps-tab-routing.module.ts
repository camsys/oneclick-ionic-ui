import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectionsStepsTabPage } from './directions-steps-tab.page';

const routes: Routes = [
  {
    path: '',
    component: DirectionsStepsTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectionsStepsTabPageRoutingModule {}
