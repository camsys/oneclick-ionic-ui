import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceFor211DetailPageRoutingModule } from './service-for211-detail-routing.module';

import { ServiceFor211DetailPage } from './service-for211-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceFor211DetailPageRoutingModule
  ],
  declarations: [ServiceFor211DetailPage]
})
export class ServiceFor211DetailPageModule {}
