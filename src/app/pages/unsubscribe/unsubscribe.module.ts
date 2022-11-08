import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnsubscribePageRoutingModule } from './unsubscribe-routing.module';

import { UnsubscribePage } from './unsubscribe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnsubscribePageRoutingModule
  ],
  declarations: [UnsubscribePage]
})
export class UnsubscribePageModule {}
