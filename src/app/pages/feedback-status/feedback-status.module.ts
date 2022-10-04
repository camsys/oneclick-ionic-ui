import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackStatusPageRoutingModule } from './feedback-status-routing.module';

import { FeedbackStatusPage } from './feedback-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedbackStatusPageRoutingModule
  ],
  declarations: [FeedbackStatusPage]
})
export class FeedbackStatusPageModule {}
