import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Accommodation } from './models/accommodation';
import { Eligibility } from './models/eligibility';
import { PageModel } from './models/page';
import { User } from './models/user';
import { AboutUsPage } from './pages/about-us/about-us.page';
import { ContactUsPage } from './pages/contact-us/contact-us.page';
import { HelpMeFindPage } from './pages/help-me-find/help-me-find.page';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';
import { UserLocatorPage } from './pages/user-locator/user-locator.page';
import { UserProfilePage } from './pages/user-profile/user-profile.page';
import { AuthService } from './services/auth.service';
import { I18nService } from './services/i18n.service';
import { LoaderService } from './services/loader.service';
import { OneClickService } from './services/one-click.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  rootPage: any = HelpMeFindPage;
  showSpinner: Boolean = false;
  currentRoute: string;

  signedInPages: PageModel[];
  signedOutPages: PageModel[];
  universalPages: PageModel[]; //Pages for both signed in and signed out users
  signInPage: PageModel;
  signUpPage: PageModel;
  profilePage: PageModel;
  user: User;
  eligibilities: Eligibility[];
  accommodations: Accommodation[];
  locale: string;
  user_name: any = { user: "" };

  constructor(public platform: Platform,
              //public exNav: ExternalNavigationService,
              private auth: AuthService,
              private loader: LoaderService,
              private oneClickProvider: OneClickService,
              private changeDetector: ChangeDetectorRef,
              private router: Router,
              private nav: NavController,
              //private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private i18n: I18nService) {

    this.initializeApp();

    router.events.pipe(takeUntil(this.unsubscribe), filter(event => event instanceof NavigationEnd))
          .subscribe((event : NavigationEnd) => 
           {
              this.currentRoute = event.url;  
           });

    // When a server error occurs, show an error message and return to the home page.
    this.oneClickProvider.httpError.pipe(takeUntil(this.unsubscribe)).subscribe((error) => {
      if (error && error.status == 500)
        this.handleError(error);
    });

    // When user is updated, update user info.
    this.auth.userUpdated.pipe(takeUntil(this.unsubscribe)).subscribe((user) => {
      this.updateUserInfo(user);
    });
  }

  // Handles errors based on their status code
  handleError(error) {

    switch(error.status) {
      case 401: // Unauthorized--sign user out and send to sign in page
        console.error("USER TOKEN EXPIRED");
        this.signOut();
        this.nav.navigateForward(SignInPage.routePath);
        this.showErrorToast('oneclick.global.error_message.auth_needed');
        break;
      default:
        this.goHome();
        this.showErrorToast('oneclick.global.error_messages.default');
        break;
    }

    this.loader.hideLoader();// stop the spinner once we're back on the home page
  }

  // Shows an error toast at the top of the screen for 3 sec, with the given (translated) message
  showErrorToast(messageCode: string) {
    this.toastCtrl.create({
      message: this.translate.instant(messageCode),
      position: 'top',
      duration: 3000
    }).then(errorToast => errorToast.present());
  }

  initializeApp() {

    //this.statusBar.styleDefault();
    //this.splashScreen.hide();

    // Set up the page links for the sidebar menu
    this.setMenu();

    // Set up the spinner div
    this.setupSpinner();

    // Get info about signed-in user
    this.getUserInfo();

    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.platform.ready().then(() => {

      this.i18n.initializeApp(); // Sets the default language based on device or browser

      // Set the locale to whatever's in storage, or use the default
      this.i18n.setLocale(this.auth.preferredLocale());

    });

  }

  // Make a call to OneClick to get the user's details
  getUserInfo() {
    // If User email and token are stored in session, make a call to 1click to get up-to-date user profile
    if(this.auth.isRegisteredUser()){
      this.oneClickProvider.getProfile()
    }

  }

  // Updates this component's user model based on the information stored in the session
  updateUserInfo(usr) {
    this.user = usr;
    if (usr) {
      this.user_name = { user: usr.first_name || (usr.email || '').split('@')[0] };
      this.eligibilities = this.user.eligibilities;
      this.accommodations = this.user.accommodations;
    }
  }

  // Set up the menu with pages for signed in and signed out scenarios
  setMenu(){

    // Pages to display regardless of whether or not user is signed in or not
    this.universalPages = [
      { title: 'home', component: "home" },
      { title: 'about_us', component: AboutUsPage },
      { title: 'contact_us', component: ContactUsPage },
      // Disabling transportation options based on feedback.
      //{ title: 'transportation', component: ParatransitServicesPage },
      { title: 'resources', component: UserLocatorPage, params: { viewType: 'services'}},
      //{ title: 'language_selector', component: "language_selector" },
      //{ title: 'privacy_policy', component: "privacy_policy" },
      // Disabling chat based on feedback.
      //{ title: 'live_211_chat', component: "live_211_chat" },
      //{ title: 'feedback', component: "feedback" }
    ] as PageModel[];

    // Pages to display if user is signed in
    this.signedInPages = this.universalPages.concat([
      //{ title: 'feedback_status', component: FeedbackStatusPage },
      { title: 'sign_out', component: "sign_out"}
    ] as PageModel[]);

    // Pages to display if user is signed out
    this.signedOutPages = ([
    ] as PageModel[]).concat(this.universalPages);

    this.signInPage = { title: 'sign_in', component: SignInPage} as PageModel;
    this.signUpPage = { title: 'sign_up', component: SignUpPage} as PageModel;
    this.profilePage = { title: 'profile', component: UserProfilePage} as PageModel;
  }

  // Open the appropriate page, or do something special for certain pages
  openPage(page) {
    switch(page.component) {
      case "home":
        this.goHome();
        break;
      case "sign_out":
        this.signOut();
        break;
      // case "privacy_policy":
      //   this.exNav.goTo('http://www.golynx.com/privacy-policy.stml');
      //   break;
      // case "language_selector":
      //   this.openLanguageSelectorModal();
      //   break;
      // case "live_211_chat":
      //   this.exNav.goTo('https://server4.clickandchat.com/chat');
      //   break;
      // case "feedback":
      //   FeedbackModalPage.createModal(this.modalCtrl,
      //                                 this.toastCtrl,
      //                                 this.translate)
      //                    .present();
      //   break;
      default:
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.router.navigate([page.component.routePath],{
            state: page.params,
          });
    }

  }

  // Check if we're already at the home page; if not, go there.
  goHome() {
    if(this.currentRoute != this.rootPage.routePath) {
      this.nav.navigateRoot(this.rootPage.routePath);
    }
  }

  signOut() {
    this.auth.signOut()
    .subscribe(
      data => {
        this.onSignOut();
      },
      error => {
        console.error('Error Signing Out');
        this.onSignOut();
      }
    );
  }

  onSignOut() {
    this.setMenu();
    //this.nav.push(this.rootPage);
    this.nav.navigateRoot(this.rootPage.routePath);
    // This isn't an error, but there is no difference in the toast
    this.showErrorToast('oneclick.global.sign_out_successful');
  }

  // Creates and presents a modal for changing the locale.
  // openLanguageSelectorModal() {
  //   let languageSelectorModal = this.modalCtrl.create(
  //     LanguageSelectorModalPage,
  //     { locale: this.i18n.currentLocale() }
  //   );
  //   languageSelectorModal.onDidDismiss(locale => {
  //     if(locale) {
  //       // If a new locale was selected, store it as the preferred locale in the session
  //       this.user = this.auth.setPreferredLocale(locale);

  //       // If user is signed in, update their information with the new locale.
  //       if(this.auth.isSignedIn()) {
  //         this.oneClickProvider.updateProfile(this.user);
  //       }
  //     }
  //   })
  //   languageSelectorModal.present();
  // }

  // Subscribe to loaderstatus to hide/show spinner
  setupSpinner() {
    this.loader.loaderStatus.subscribe((loaderStatus:boolean) => {
      this.showSpinner = loaderStatus;
      //if (loaderStatus) this.changeDetector.markForCheck(); // Makes sure spinner doesn't lag
      //else this.changeDetector.detectChanges(); // Makes sure spinner doesn't lag
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
