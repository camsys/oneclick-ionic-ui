import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpMeFindPageRoutingModule } from './help-me-find-routing.module';

import { HelpMeFindPage } from './help-me-find.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpMeFindPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [HelpMeFindPage]
})
export class HelpMeFindPageModule {}
