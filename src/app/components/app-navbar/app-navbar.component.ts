import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { HelpMeFindPage } from 'src/app/pages/help-me-find/help-me-find.page';
import { LanguageSelectorModalPage } from 'src/app/pages/language-selector-modal/language-selector-modal.page';
import { AuthService } from 'src/app/services/auth.service';
import { I18nService } from 'src/app/services/i18n.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss'],
})
export class AppNavbarComponent implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  currentRoute:string;
  user: User;

  @Input() headerTitle: string; // If no title is provided, display the logo.
  @Input() showTitle: boolean = true;//usually we do want to show the title of the page on the top toolbar

  constructor(public oneClickProvider: OneClickService,
          public navCtrl: NavController,
          private router: Router,
  			  private modalCtrl: ModalController,
  			  private i18n: I18nService,
  			  private auth: AuthService,
          private translate: TranslateService,
          private title: Title) {

            this.title.setTitle(this.translate.instant("oneclick.global.application_name"));
  }

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe), filter(event => event instanceof NavigationEnd))
          .subscribe((event : NavigationEnd) => 
           {
              this.currentRoute = event.url;  
           });

    if (this.headerTitle) this.title.setTitle(this.headerTitle);
  }

  // Creates and presents a modal for changing the locale.
  openLanguageSelectorModal() {
    this.modalCtrl.create({
      component: LanguageSelectorModalPage,
      componentProps: { 
        locale: this.i18n.currentLocale() 
      }
    }).then(modal => {
      modal.onDidDismiss().then(resp => {
        if(resp && resp.data && resp.data.locale) {
            // If a new locale was selected, store it as the preferred locale in the session
          this.user = this.auth.setPreferredLocale(resp.data.locale);

          // If user is signed in, update their information with the new locale.
          if(this.auth.isSignedIn()) {
            this.oneClickProvider.updateProfile(this.user);
          }
        }
      });
      return modal;
    }).then(languageSelectorModal => languageSelectorModal.present());
  }

  // Check if we're already at the home page; if not, go there.

  goHome() {
    if(!this.isHomePage()) {
      this.navCtrl.navigateRoot(HelpMeFindPage.routePath);
    }
  }

  isHomePage(): boolean {
    return this.currentRoute === HelpMeFindPage.routePath || this.currentRoute === "/";
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
