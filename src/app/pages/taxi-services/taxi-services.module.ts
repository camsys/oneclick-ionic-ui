import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxiServicesPageRoutingModule } from './taxi-services-routing.module';

import { TaxiServicesPage } from './taxi-services.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    TaxiServicesPageRoutingModule
  ],
  declarations: [TaxiServicesPage]
})
export class TaxiServicesPageModule {}
