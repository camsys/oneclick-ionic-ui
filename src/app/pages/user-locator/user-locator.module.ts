import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserLocatorPageRoutingModule } from './user-locator-routing.module';

import { UserLocatorPage } from './user-locator.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    UserLocatorPageRoutingModule,
    TranslateModule
  ],
  declarations: [UserLocatorPage]
})
export class UserLocatorPageModule {}
