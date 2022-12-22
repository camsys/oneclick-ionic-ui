import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransportationEligibilityPage } from './transportation-eligibility.page';

const routes: Routes = [
  {
    path: '',
    component: TransportationEligibilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportationEligibilityPageRoutingModule {}
