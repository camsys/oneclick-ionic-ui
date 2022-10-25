import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransportationEligibilityPageRoutingModule } from './transportation-eligibility-routing.module';

import { TransportationEligibilityPage } from './transportation-eligibility.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    TransportationEligibilityPageRoutingModule
  ],
  declarations: [TransportationEligibilityPage]
})
export class TransportationEligibilityPageModule {}
