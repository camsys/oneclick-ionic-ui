import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupCallbackRoutingModule } from './signup-callback-routing.module';
import { SignupCallbackComponent } from './signup-callback.component';

@NgModule({
  declarations: [SignupCallbackComponent],
  imports: [
    CommonModule,
    SignupCallbackRoutingModule,
  ],
})
export class SignupCallbackModule {}
