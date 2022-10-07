import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ExternalNavigationService {

  constructor(public http: HttpClient,
    public alertCtrl: AlertController,
    public inAppBrowser: InAppBrowser,
    public translate: TranslateService) { }

  // Opens an external website, but first confirms with the user that they want to leave the site
  goTo(url: any) {
    event.preventDefault();
    let confirmExit = this.alertCtrl.create({
    title: this.translate.instant("oneclick.pages.external_navigation.header"),
    message: this.translate.instant("oneclick.pages.external_navigation.message"),
    buttons: [
    {
    text: this.translate.instant("oneclick.pages.external_navigation.cancel_button"),
    role: 'cancel',
    handler: () => { }
    },
    {
    text: this.translate.instant("oneclick.pages.external_navigation.confirm_button"),
    handler: () => {
      this.goDirectlyTo(url);
    }
    }
    ]
    })
    confirmExit.present();
  }

// Navigates directly to the given url.
goDirectlyTo(url: any) {
this.inAppBrowser.create(url, '_system');
}

}
