import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackStatusPageRoutingModule } from './feedback-status-routing.module';

import { FeedbackStatusPage } from './feedback-status.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    FeedbackStatusPageRoutingModule
  ],
  declarations: [FeedbackStatusPage]
})
export class FeedbackStatusPageModule {}
