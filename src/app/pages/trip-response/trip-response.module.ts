import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripResponsePageRoutingModule } from './trip-response-routing.module';

import { TripResponsePage } from './trip-response.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    TripResponsePageRoutingModule
  ],
  declarations: [TripResponsePage]
})
export class TripResponsePageModule {}
