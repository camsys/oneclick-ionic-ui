import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsModalPage } from './sms-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SmsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsModalPageRoutingModule {}
