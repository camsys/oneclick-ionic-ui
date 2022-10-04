import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResendEmailConfirmationPageRoutingModule } from './resend-email-confirmation-routing.module';

import { ResendEmailConfirmationPage } from './resend-email-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResendEmailConfirmationPageRoutingModule
  ],
  declarations: [ResendEmailConfirmationPage]
})
export class ResendEmailConfirmationPageModule {}
