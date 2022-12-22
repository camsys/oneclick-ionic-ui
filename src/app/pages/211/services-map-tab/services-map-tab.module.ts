import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesMapTabPageRoutingModule } from './services-map-tab-routing.module';

import { ServicesMapTabPage } from './services-map-tab.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    ServicesMapTabPageRoutingModule
  ],
  declarations: [ServicesMapTabPage]
})
export class ServicesMapTabPageModule {}
