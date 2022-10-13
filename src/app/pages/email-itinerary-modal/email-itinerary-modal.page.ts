import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ItineraryModel } from 'src/app/models/itinerary';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-email-itinerary-modal',
  templateUrl: './email-itinerary-modal.page.html',
  styleUrls: ['./email-itinerary-modal.page.scss'],
})
export class EmailItineraryModalPage implements OnInit {

  emailForm: FormGroup;
  itinerary: ItineraryModel;

  constructor(public navParams: NavParams,
              private modalCtrl: ModalController,
              public oneClick: OneClickService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private auth: AuthService) {

    this.itinerary = navParams.get('itinerary');
    this.emailForm = this.formBuilder.group({
      email: [this.auth.presentableEmail()]
    });
  }
  

  async cancel() {
    await this.modalCtrl.dismiss(null);
  }

  async send(){

    this.oneClick.emailItinerary(this.emailForm.value['email'],this.itinerary.id);
    await this.modalCtrl.dismiss(null);
    this.toastCtrl.create({
      message: this.translate.instant('oneclick.pages.email.email_sent'),
      position: 'bottom',
      duration: 3000
    }).then(toast => toast.present());

  }

  ngOnInit() {
  }


}
