import { Component } from '@angular/core';
import { ItineraryModel } from "../../models/itinerary";
import { IonicPage, ViewController, NavParams, ToastController } from 'ionic-angular';
import { OneClickProvider } from '../../providers/one-click/one-click';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the EmailItineraryModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-email-itinerary-modal',
  templateUrl: 'email-itinerary-modal.html',
})
export class EmailItineraryModalPage {

  emailForm: FormGroup;
  itinerary: ItineraryModel;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public oneClick: OneClickProvider,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private auth: AuthProvider) {
    this.itinerary = navParams.get('itinerary');
    this.emailForm = this.formBuilder.group({
      email: [this.auth.presentableEmail()]
    });
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  send(){

    this.oneClick.emailItinerary(this.emailForm.value['email'],this.itinerary.id);
    this.viewCtrl.dismiss(null);
    let toast = this.toastCtrl.create({
      message: this.translate.instant('oneclick.pages.email.email_sent'),
      position: 'bottom',
      duration: 3000
    });
    toast.present();

  }

  ionViewDidLoad() {
  }

}
