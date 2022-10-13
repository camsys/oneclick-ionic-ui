import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceFor211DetailPageRoutingModule } from './service-for211-detail-routing.module';

import { ServiceFor211DetailPage } from './service-for211-detail.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    ServiceFor211DetailPageRoutingModule
  ],
  declarations: [ServiceFor211DetailPage]
})
export class ServiceFor211DetailPageModule {}
