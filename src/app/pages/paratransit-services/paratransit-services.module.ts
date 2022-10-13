import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParatransitServicesPageRoutingModule } from './paratransit-services-routing.module';

import { ParatransitServicesPage } from './paratransit-services.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    ParatransitServicesPageRoutingModule
  ],
  declarations: [ParatransitServicesPage]
})
export class ParatransitServicesPageModule {}
