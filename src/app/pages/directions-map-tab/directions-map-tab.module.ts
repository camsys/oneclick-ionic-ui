import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectionsMapTabPageRoutingModule } from './directions-map-tab-routing.module';

import { DirectionsMapTabPage } from './directions-map-tab.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    DirectionsMapTabPageRoutingModule
  ],
  declarations: [DirectionsMapTabPage]
})
export class DirectionsMapTabPageModule {}
