import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpMeFindPageRoutingModule } from './help-me-find-routing.module';

import { HelpMeFindPage } from './help-me-find.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpMeFindPageRoutingModule
  ],
  declarations: [HelpMeFindPage]
})
export class HelpMeFindPageModule {}
