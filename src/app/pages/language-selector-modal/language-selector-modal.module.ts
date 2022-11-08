import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguageSelectorModalPageRoutingModule } from './language-selector-modal-routing.module';

import { LanguageSelectorModalPage } from './language-selector-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    LanguageSelectorModalPageRoutingModule
  ],
  declarations: [LanguageSelectorModalPage]
})
export class LanguageSelectorModalPageModule {}
