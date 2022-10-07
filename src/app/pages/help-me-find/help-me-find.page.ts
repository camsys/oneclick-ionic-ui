import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Alert } from 'src/app/models/alert';
import { User } from 'src/app/models/user';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-help-me-find',
  templateUrl: './help-me-find.page.html',
  styleUrls: ['./help-me-find.page.scss'],
})
export class HelpMeFindPage implements OnInit {

  alerts: Alert[];
  user: User;

  awsImageLocation;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform: Platform,
              private alertCtrl: AlertController,
              public oneClickProvider: OneClickService,
              public sanitizer: DomSanitizer,
              public translate: TranslateService,
              public events: Events) {
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
    // Subscribe to sign out event and refresh alerts when user is signed out
    this.events.subscribe("user:signed_out", () => {
      this.oneClickProvider.getAlerts()
        .then(alerts => this.alerts = alerts);
    });
  }

  ionViewWillLeave() {
    // Unsubscribe from sign out event when page is no longer active
    this.events.unsubscribe("user:signed_out");
  }

  openResourcesPage() {
     console.log(this);

    this.navCtrl.push(UserLocatorPage, { viewType: 'services'});
  }

  openTransportationPage() {
    this.navCtrl.push(UserLocatorPage, { viewType: 'transportation'});
  }


  presentAlerts() {

    //document.getElementById('messages-button').style.display = "none";

    for(let entry of this.alerts) {
      let alert = this.alertCtrl.create({
        title: entry.subject,
        subTitle: entry.message,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.ackAlert(entry);
          }
        }]
      });
      alert.present();
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
