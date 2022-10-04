import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceFor211ModalPageRoutingModule } from './service-for211-modal-routing.module';

import { ServiceFor211ModalPage } from './service-for211-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceFor211ModalPageRoutingModule
  ],
  declarations: [ServiceFor211ModalPage]
})
export class ServiceFor211ModalPageModule {}
