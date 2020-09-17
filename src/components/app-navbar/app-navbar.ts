import { Component, Input } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LanguageSelectorModalPage } from '../../pages/language-selector-modal/language-selector-modal';
import { HelpMeFindPage } from '../../pages/help-me-find/help-me-find';

// PROVIDERS
import { OneClickProvider } from '../../providers/one-click/one-click';
import { I18nProvider } from '../../providers/i18n/i18n';
import { AuthProvider } from '../../providers/auth/auth';

// MODELS
import { User } from '../../models/user';

/**
 * Generated class for the AppNavbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: 'app-navbar.html'
})
export class AppNavbarComponent {

  user: User;

  @Input() headerTitle: string; // If no title is provided, display the logo.

  constructor(public oneClickProvider: OneClickProvider,
          public navCtrl: NavController,
  			  private modalCtrl: ModalController,
  			  private i18n: I18nProvider,
  			  private auth: AuthProvider) {
  }

  // Creates and presents a modal for changing the locale.
  openLanguageSelectorModal() {
    let languageSelectorModal = this.modalCtrl.create(
      LanguageSelectorModalPage,
      { locale: this.i18n.currentLocale() }
    );
    languageSelectorModal.onDidDismiss(locale => {
      if(locale) {
        // If a new locale was selected, store it as the preferred locale in the session
        this.user = this.auth.setPreferredLocale(locale);

        // If user is signed in, update their information with the new locale.
        if(this.auth.isSignedIn()) {
          this.oneClickProvider.updateProfile(this.user);
        }
      }
    })
    languageSelectorModal.present();
  }

  // Check if we're already at the home page; if not, go there.
  goHome() {
    if((this.navCtrl.getActive() && this.navCtrl.getActive().name) !== "HelpMeFindPage") {
      this.navCtrl.setRoot(HelpMeFindPage);
    }
  }

  private isHomePage(): boolean {
    return ((this.navCtrl.getActive() && this.navCtrl.getActive().name) == "HelpMeFindPage");
  }

}
