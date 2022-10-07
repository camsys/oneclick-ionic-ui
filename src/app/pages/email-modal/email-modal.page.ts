import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
              public viewCtrl: ViewController,
              public oneClick: OneClickService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private auth: AuthService) {
                
     this.service = navParams.get('service');
     this.services = navParams.get('services');
     this.emailForm = this.formBuilder.group({
      email: [this.auth.presentableEmail()]
    });
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  send(){

    var ids = new Array();

    // Get Ids of Services Array if it was passed
    if(this.services != null){
      for (var i = 0; i < this.services.length; i++) {
        ids.push(this.services[i].id);
      }
    }

    // Get ID of a single service if it was passed
    if(this.service != null){
      ids.push(this.service.id);
    }

    this.oneClick.email211Service(this.emailForm.value['email'],ids);
    this.viewCtrl.dismiss(null);
    let toast = this.toastCtrl.create({
      message: this.translate.instant('oneclick.pages.email.email_sent'),
      position: 'bottom',
      duration: 3000
    });
    toast.present();

  }

  ngOnInit() {
  }


}
