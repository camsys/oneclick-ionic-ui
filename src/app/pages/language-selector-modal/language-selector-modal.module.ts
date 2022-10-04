import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguageSelectorModalPageRoutingModule } from './language-selector-modal-routing.module';

import { LanguageSelectorModalPage } from './language-selector-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanguageSelectorModalPageRoutingModule
  ],
  declarations: [LanguageSelectorModalPage]
})
export class LanguageSelectorModalPageModule {}
