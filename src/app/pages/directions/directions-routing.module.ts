import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectionsPage } from './directions.page';

const routes: Routes = [
 
  {
    path: 'tabs',
    component: DirectionsPage,
    children: [
      {
        path: 'steps-tab',
        loadChildren: () => import('../directions-steps-tab/directions-steps-tab.module').then(m => m.DirectionsStepsTabPageModule)
      },
      {
        path: 'map-tab',
        loadChildren: () => import('../directions-map-tab/directions-map-tab.module').then(m => m.DirectionsMapTabPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/steps-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectionsPageRoutingModule {}
