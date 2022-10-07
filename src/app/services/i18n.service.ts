import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(public http: HttpClient,
    public events: Events,
    //public platform: Platform,
    public translate: TranslateService) { }

  // Initializes the App, adding available languages and setting the default language
  initializeApp() {
    //console.log('start loading translations');
    this.events.publish("spinner:show");
    this.translate.addLangs(environment.AVAILABLE_LOCALES);
    this.translate.setDefaultLang(environment.DEFAULT_LOCALE);

    // If on mobile, try to get the device's preferred locale
    // if(this.platform.is('cordova')) {
    // Globalization.getPreferredLanguage().then(result => {
    // this.translate.setDefaultLang(this.getSuitableLanguage(result.value));
    // });
    // } else { // Otherwise, try to get the browser's preferred locale
    this.translate.setDefaultLang(this.getSuitableLanguage(this.translate.getBrowserLang()));
    //}

    // When user is updated, set locale to user's preferred locale.
    this.events.subscribe("user:updated", (user) => {
    if(user.preferred_locale) {
    this.setLocale(user.preferred_locale);
    }
    })


  }

  // Iron out any quirks in the browser/device's preferred locale code. Then,
  // check if it's in our list of available locales. If so, use it. Otherwise,
  // use the default locale.
  getSuitableLanguage(language) {
  language = language.substring(0, 2).toLowerCase();
  if(environment.AVAILABLE_LOCALES.some(loc => loc == language)) {
  return language;
  } else {
  return environment.DEFAULT_LOCALE;
  }
  }

  // Returns the current locale being used (or the default one)
  currentLocale(): string {
  return this.translate.currentLang || this.translate.getDefaultLang() || environment.DEFAULT_LOCALE;
  }

  // Sets the locale, defaulting to default language.
  setLocale(locale: string) {
  this.translate.use(locale || this.currentLocale());
  this.events.publish("spinner:hide");
  //console.log('finish loading translations');
  }

}

export function getCurrentLocale(i18n){
  return i18n.currentLocale();
}
