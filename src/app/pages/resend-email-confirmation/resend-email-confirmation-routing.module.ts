import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResendEmailConfirmationPage } from './resend-email-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: ResendEmailConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResendEmailConfirmationPageRoutingModule {}
