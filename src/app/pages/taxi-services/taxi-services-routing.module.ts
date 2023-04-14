import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxiServicesPage } from './taxi-services.page';

const routes: Routes = [
  {
    path: '',
    component: TaxiServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxiServicesPageRoutingModule {}
