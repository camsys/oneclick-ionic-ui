import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Alert } from 'src/app/models/alert';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { UserLocatorPage } from '../user-locator/user-locator.page';

@Component({
  selector: 'app-help-me-find',
  templateUrl: './help-me-find.page.html',
  styleUrls: ['./help-me-find.page.scss'],
})
export class HelpMeFindPage implements OnInit {
  private unsubscribe:Subject<any>;

  static routePath: string = '/home';

  alerts: Alert[];
  user: User;

  awsImageLocation;

  constructor(public router: Router,
              private platform: Platform,
              private alertCtrl: AlertController,
              public oneClickProvider: OneClickService,
              public sanitizer: DomSanitizer,
              public translate: TranslateService,
              public auth: AuthService) {
  }
  
  ngOnInit() {
  }

  ionViewDidLoad() {
    this.awsImageLocation = this.sanitizer.bypassSecurityTrustStyle('url(' + '../assets/img/GettyImages-930896740_sized.png)');

    // Wait until after platform is ready, so we have the user's preferred locale
    this.platform.ready().then(() => {
      this.oneClickProvider.getAlerts()
        .then(alerts => this.alerts = alerts);
    });
  }

  ionViewWillEnter() {
    this.unsubscribe = new Subject<any>();
    // Subscribe to sign out event and refresh alerts when user is signed out
    this.auth.userSignedOut.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.oneClickProvider.getAlerts()
        .then(alerts => this.alerts = alerts);
    });
  }

  ionViewWillLeave() {
    // Unsubscribe from sign out event when page is no longer active
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openResourcesPage() {
    console.log(this);

    this.router.navigate([UserLocatorPage.routePath, 'services']);
  }

  openTransportationPage() {
    this.router.navigate([UserLocatorPage.routePath, 'transportation']);
  }


  presentAlerts() {

    //document.getElementById('messages-button').style.display = "none";

    for(let entry of this.alerts) {
      this.alertCtrl.create({
        header: entry.subject,
        subHeader: entry.message,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.ackAlert(entry);
          }
        }]
      }).then(alert => alert.present());
    }
  }

  ackAlert(alert: Alert){
    //this.oneClickProvider.ackAlert(alert);
  }

  // Updates this component's user model based on the information stored in the session
  updateUserInfo(usr) {
    this.user = usr;
  }

}
