import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsModalPageRoutingModule } from './sms-modal-routing.module';

import { SmsModalPage } from './sms-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    SmsModalPageRoutingModule
  ],
  declarations: [SmsModalPage]
})
export class SmsModalPageModule {}
