import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ServiceModel } from 'src/app/models/service';
import { AuthService } from 'src/app/services/auth.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.page.html',
  styleUrls: ['./email-modal.page.scss'],
})
export class EmailModalPage implements OnInit {

  emailForm: FormGroup;
  service: ServiceModel;
  services: ServiceModel[];

  constructor(public navParams: NavParams,
              public modalCtrl: ModalController,
              public oneClick: OneClickService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private auth: AuthService) {
                
     this.service = navParams.data.service;
     this.services = navParams.data.services;
     this.emailForm = this.formBuilder.group({
      email: [this.auth.presentableEmail()]
    });
  }

  async cancel() {
    await this.modalCtrl.dismiss(null);
  }

  async send(){

    var ids = new Array();

    // Get Ids of Services Array if it was passed
    if (this.services) {
      for (var i = 0; i < this.services.length; i++) {
        ids.push(this.services[i].id);
      }
    }

    // Get ID of a single service if it was passed
    if (this.service) {
      ids.push(this.service.id);
    }

    this.oneClick.email211Service(this.emailForm.value['email'],ids);
    
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
