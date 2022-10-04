import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxiServicesPageRoutingModule } from './taxi-services-routing.module';

import { TaxiServicesPage } from './taxi-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxiServicesPageRoutingModule
  ],
  declarations: [TaxiServicesPage]
})
export class TaxiServicesPageModule {}
