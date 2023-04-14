import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParatransitServicesPage } from './paratransit-services.page';

const routes: Routes = [
  {
    path: '',
    component: ParatransitServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParatransitServicesPageRoutingModule {}
