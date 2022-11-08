import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackStatusPage } from './feedback-status.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackStatusPageRoutingModule {}
