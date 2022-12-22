import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesPage } from './services.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: ServicesPage,
    children: [
      {
        path: 'list-tab',
        loadChildren: () => import('../services-list-tab/services-list-tab.module').then(m => m.ServicesListTabPageModule)
      },
      {
        path: 'map-tab',
        loadChildren: () => import('../services-map-tab/services-map-tab.module').then(m => m.ServicesMapTabPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/list-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPageRoutingModule {}
