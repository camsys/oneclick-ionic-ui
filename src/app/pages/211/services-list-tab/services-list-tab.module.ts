import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesListTabPageRoutingModule } from './services-list-tab-routing.module';

import { ServicesListTabPage } from './services-list-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesListTabPageRoutingModule
  ],
  declarations: [ServicesListTabPage]
})
export class ServicesListTabPageModule {}
