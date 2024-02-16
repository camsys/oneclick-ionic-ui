import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { HelpMeFindPage } from 'src/app/pages/help-me-find/help-me-find.page';
import { LanguageSelectorModalPage } from 'src/app/pages/language-selector-modal/language-selector-modal.page';
import { AuthService } from 'src/app/services/auth.service';
import { I18nService } from 'src/app/services/i18n.service';
import { MenuService } from 'src/app/services/menu.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { appConfig } from 'src/environments/appConfig';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss'],
})
export class AppNavbarComponent implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  currentRoute:string;
  user: User;
  skipLinkPath: string;

  ariaExpanded: boolean = false;

  @Input() skipId: string;// the id to use as the skip to content anchor
  @Input() headerTitle: string; // If no title is provided, display the logo.
  @Input() showTitle: boolean = true;//usually we do want to show the title of the page on the top toolbar

  constructor(public oneClickProvider: OneClickService,
          public navCtrl: NavController,
          private router: Router,
  			  private modalCtrl: ModalController,
  			  public i18n: I18nService,
  			  private auth: AuthService,
          private translate: TranslateService,
          private title: Title,
          private menuService: MenuService,
          private menuCtrl: MenuController) {

            this.title.setTitle(this.translate.instant("oneclick.global.application_name"));
  }

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe), filter(event => event instanceof NavigationEnd))
          .subscribe((event : NavigationEnd) =>
           {
              this.currentRoute = event.url;
              let routePieces = this.router.url.split('#');
              this.skipLinkPath = routePieces[0] + '#' + this.skipId;
           });

    this.menuService.menuIsOpen.pipe(takeUntil(this.unsubscribe)).subscribe(
      (isOpen: boolean) => {
        this.ariaExpanded = isOpen;
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

  menuOpened() {
    this.menuService.setMenuIsOpen(true);
    this.menuCtrl.open();//need to manually open the menu
  }
  // Check if we're already at the home page; if not, go there.

  isHomePage(): boolean {
    if (!this.currentRoute) return true;

    if (this.currentRoute === "/") return true;

    if (this.currentRoute.length > 1) {
      let remainder = this.currentRoute.substring(1);//remove the leading '/'
      let routePieces = remainder.split('#');//handle the skip link if active
      return routePieces[0]  === appConfig.DEFAULT_ROUTE;
    }

    //don't know what this could be
    return false;//shouldn't happen but just in case
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
