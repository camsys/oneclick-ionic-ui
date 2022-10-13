import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectionsStepsTabPageRoutingModule } from './directions-steps-tab-routing.module';

import { DirectionsStepsTabPage } from './directions-steps-tab.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    DirectionsStepsTabPageRoutingModule
  ],
  declarations: [DirectionsStepsTabPage]
})
export class DirectionsStepsTabPageModule {}
