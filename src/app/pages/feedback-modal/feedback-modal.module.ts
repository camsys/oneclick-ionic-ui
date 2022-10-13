import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackModalPageRoutingModule } from './feedback-modal-routing.module';

import { FeedbackModalPage } from './feedback-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    FeedbackModalPageRoutingModule
  ],
  declarations: [FeedbackModalPage]
})
export class FeedbackModalPageModule {}
