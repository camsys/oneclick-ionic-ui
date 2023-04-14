import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceFor211ModalPage } from './service-for211-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceFor211ModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceFor211ModalPageRoutingModule {}
