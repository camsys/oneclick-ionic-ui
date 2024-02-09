import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AnimationController, IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LanguageSelectorModalPageModule } from './pages/language-selector-modal/language-selector-modal.module';
import { PipesModule } from './pipes/pipes.module';
import { ComponentsModule } from './components/components.module';
import { CommonModule } from '@angular/common';
import { ServiceFor211ModalPageModule } from './pages/211/service-for211-modal/service-for211-modal.module';
import { EmailModalPageModule } from './pages/email-modal/email-modal.module';
import { EmailItineraryModalPageModule } from './pages/email-itinerary-modal/email-itinerary-modal.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    LanguageSelectorModalPageModule,
    ServiceFor211ModalPageModule,
    EmailModalPageModule,
    EmailItineraryModalPageModule,
    ComponentsModule,
    PipesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), 
    IonicModule.forRoot({
      swipeBackEnabled: false,
      mode: 'md', //forces md theme always, even on iOS
      navAnimation: _ => new AnimationController().create()//turned off default page transition animation
    }), ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
