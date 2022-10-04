import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParatransitServicesPageRoutingModule } from './paratransit-services-routing.module';

import { ParatransitServicesPage } from './paratransit-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParatransitServicesPageRoutingModule
  ],
  declarations: [ParatransitServicesPage]
})
export class ParatransitServicesPageModule {}
