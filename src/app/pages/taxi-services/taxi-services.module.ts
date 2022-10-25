import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxiServicesPageRoutingModule } from './taxi-services-routing.module';

import { TaxiServicesPage } from './taxi-services.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    TaxiServicesPageRoutingModule
  ],
  declarations: [TaxiServicesPage]
})
export class TaxiServicesPageModule {}
