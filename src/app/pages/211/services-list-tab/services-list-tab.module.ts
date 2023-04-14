import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesListTabPageRoutingModule } from './services-list-tab-routing.module';

import { ServicesListTabPage } from './services-list-tab.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    ServicesListTabPageRoutingModule
  ],
  declarations: [ServicesListTabPage]
})
export class ServicesListTabPageModule {}
