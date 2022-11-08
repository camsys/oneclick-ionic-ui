import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailModalPage } from './email-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EmailModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailModalPageRoutingModule {}
