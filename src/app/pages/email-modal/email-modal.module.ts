import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailModalPageRoutingModule } from './email-modal-routing.module';

import { EmailModalPage } from './email-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    EmailModalPageRoutingModule
  ],
  declarations: [EmailModalPage]
})
export class EmailModalPageModule {}
