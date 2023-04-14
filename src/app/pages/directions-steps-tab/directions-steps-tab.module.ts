import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectionsStepsTabPageRoutingModule } from './directions-steps-tab-routing.module';

import { DirectionsStepsTabPage } from './directions-steps-tab.page';
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
    DirectionsStepsTabPageRoutingModule
  ],
  declarations: [DirectionsStepsTabPage]
})
export class DirectionsStepsTabPageModule {}
