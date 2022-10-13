import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesPage } from './services.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesPage
  },
  {
    path: 'list-tab',
    children: [
      {
        path: '',
        loadChildren: () => import('../services-list-tab/services-list-tab.module').then( m => m.ServicesListTabPageModule)
      }
    ]
  },
  {
    path: 'map-tab',
    children: [
      {
        path: '',
        loadChildren: () => import('../services-map-tab/services-map-tab.module').then( m => m.ServicesMapTabPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPageRoutingModule {}
