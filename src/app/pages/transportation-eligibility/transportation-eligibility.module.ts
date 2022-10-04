import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransportationEligibilityPageRoutingModule } from './transportation-eligibility-routing.module';

import { TransportationEligibilityPage } from './transportation-eligibility.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransportationEligibilityPageRoutingModule
  ],
  declarations: [TransportationEligibilityPage]
})
export class TransportationEligibilityPageModule {}
