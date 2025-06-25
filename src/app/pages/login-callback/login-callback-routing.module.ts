import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginCallbackComponent } from './login-callback.component';

const routes: Routes = [
  {
    path: '',
    component: LoginCallbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginCallbackRoutingModule {}
