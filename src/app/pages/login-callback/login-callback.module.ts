import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginCallbackRoutingModule } from './login-callback-routing.module';
import { LoginCallbackComponent } from './login-callback.component';

@NgModule({
  declarations: [LoginCallbackComponent],
  imports: [
    CommonModule,
    LoginCallbackRoutingModule,
  ],
})
export class LoginCallbackModule {}
