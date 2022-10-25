import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    TranslateModule
  ]
})
export class SharedModule { }
