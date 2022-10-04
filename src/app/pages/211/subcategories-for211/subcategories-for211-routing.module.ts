import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubcategoriesFor211Page } from './subcategories-for211.page';

const routes: Routes = [
  {
    path: '',
    component: SubcategoriesFor211Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubcategoriesFor211PageRoutingModule {}
