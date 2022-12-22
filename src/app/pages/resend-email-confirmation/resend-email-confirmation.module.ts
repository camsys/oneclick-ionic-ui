import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResendEmailConfirmationPageRoutingModule } from './resend-email-confirmation-routing.module';

import { ResendEmailConfirmationPage } from './resend-email-confirmation.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    ResendEmailConfirmationPageRoutingModule
  ],
  declarations: [ResendEmailConfirmationPage]
})
export class ResendEmailConfirmationPageModule {}
