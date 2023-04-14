import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpMeFindPage } from './help-me-find.page';

const routes: Routes = [
  {
    path: '',
    component: HelpMeFindPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpMeFindPageRoutingModule {}
