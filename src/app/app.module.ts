import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormatPhoneNumberPipe } from './pipes/format-phone-number.pipe';
import { PrettyDistancePipe } from './pipes/pretty-distance.pipe';
import { PrettyFarePipe } from './pipes/pretty-fare.pipe';
import { PrettyTableNamePipe } from './pipes/pretty-table-name.pipe';
import { PrettyTimePipe } from './pipes/pretty-time.pipe';
import { ScheduleDayPipe } from './pipes/schedule-day.pipe';
import { ScheduleTimePipe } from './pipes/schedule-time.pipe';
import { ToStringPipe } from './pipes/to-string.pipe';

@NgModule({
  declarations: [AppComponent, FormatPhoneNumberPipe, PrettyDistancePipe, PrettyFarePipe, PrettyTableNamePipe, PrettyTimePipe, ScheduleDayPipe, ScheduleTimePipe, ToStringPipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
