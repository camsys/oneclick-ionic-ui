import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsModalPageRoutingModule } from './sms-modal-routing.module';

import { SmsModalPage } from './sms-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmsModalPageRoutingModule
  ],
  declarations: [SmsModalPage]
})
export class SmsModalPageModule {}
