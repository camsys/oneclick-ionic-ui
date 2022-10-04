import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLocatorPage } from './user-locator.page';

const routes: Routes = [
  {
    path: '',
    component: UserLocatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserLocatorPageRoutingModule {}
