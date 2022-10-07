import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { LanguageSelectorModalPage } from 'src/app/pages/language-selector-modal/language-selector-modal.page';
import { AuthService } from 'src/app/services/auth.service';
import { I18nService } from 'src/app/services/i18n.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss'],
})
export class AppNavbarComponent implements OnInit {

  user: User;

  @Input() headerTitle: string; // If no title is provided, display the logo.

  constructor(public oneClickProvider: OneClickService,
          public navCtrl: NavController,
  			  private modalCtrl: ModalController,
  			  private i18n: I18nService,
  			  private auth: AuthService) {
  }

  ngOnInit(): void {
    
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
