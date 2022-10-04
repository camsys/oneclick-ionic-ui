import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceFor211DetailPage } from './service-for211-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceFor211DetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceFor211DetailPageRoutingModule {}
