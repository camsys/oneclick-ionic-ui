import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripResponsePageRoutingModule } from './trip-response-routing.module';

import { TripResponsePage } from './trip-response.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    PipesModule,
    TripResponsePageRoutingModule
  ],
  declarations: [TripResponsePage]
})
export class TripResponsePageModule {}
