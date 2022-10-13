import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectionsPage } from './directions.page';

const routes: Routes = [
  {
    path: '',
    component: DirectionsPage
  },
  {
    path: 'steps-tab',
    children: [
      {
        path: '',
        loadChildren: () => import('../directions-steps-tab/directions-steps-tab.module').then( m => m.DirectionsStepsTabPageModule)
      }
    ]
  },
  {
    path: 'map-tab',
    children: [
      {
        path: '',
        loadChildren: () => import('../directions-map-tab/directions-map-tab.module').then( m => m.DirectionsMapTabPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectionsPageRoutingModule {}
