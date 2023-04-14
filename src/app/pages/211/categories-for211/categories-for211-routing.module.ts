import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesFor211Page } from './categories-for211.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriesFor211Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesFor211PageRoutingModule {}
