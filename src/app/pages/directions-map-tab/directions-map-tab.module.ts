import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectionsMapTabPageRoutingModule } from './directions-map-tab-routing.module';

import { DirectionsMapTabPage } from './directions-map-tab.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    SharedModule,
    DirectionsMapTabPageRoutingModule
  ],
  declarations: [DirectionsMapTabPage]
})
export class DirectionsMapTabPageModule {}
