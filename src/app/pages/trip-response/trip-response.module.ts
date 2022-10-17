import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripResponsePageRoutingModule } from './trip-response-routing.module';

import { TripResponsePage } from './trip-response.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PrettyTimePipe } from 'src/app/pipes/pretty-time.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    PipesModule,
    TripResponsePageRoutingModule
  ],
  declarations: [TripResponsePage]
})
export class TripResponsePageModule {}
