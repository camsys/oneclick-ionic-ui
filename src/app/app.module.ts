import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AnimationController, IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, FormatPhoneNumberPipe, PrettyDistancePipe, PrettyFarePipe, PrettyTableNamePipe, PrettyTimePipe, ScheduleDayPipe, ScheduleTimePipe, ToStringPipe],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), 
    IonicModule.forRoot({
      swipeBackEnabled: false,
      navAnimation: _ => new AnimationController().create()//turned off default page transition animation
    }), ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
