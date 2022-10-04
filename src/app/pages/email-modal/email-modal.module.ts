import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailModalPageRoutingModule } from './email-modal-routing.module';

import { EmailModalPage } from './email-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailModalPageRoutingModule
  ],
  declarations: [EmailModalPage]
})
export class EmailModalPageModule {}
