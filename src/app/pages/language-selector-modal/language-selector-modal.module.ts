import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguageSelectorModalPageRoutingModule } from './language-selector-modal-routing.module';

import { LanguageSelectorModalPage } from './language-selector-modal.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    LanguageSelectorModalPageRoutingModule,
    TranslateModule
  ],
  declarations: [LanguageSelectorModalPage]
})
export class LanguageSelectorModalPageModule {}
