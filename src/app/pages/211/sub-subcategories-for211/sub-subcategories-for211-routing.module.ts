import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubSubcategoriesFor211Page } from './sub-subcategories-for211.page';

const routes: Routes = [
  {
    path: '',
    component: SubSubcategoriesFor211Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubSubcategoriesFor211PageRoutingModule {}
