import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesMapTabPage } from './services-map-tab.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesMapTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesMapTabPageRoutingModule {}
