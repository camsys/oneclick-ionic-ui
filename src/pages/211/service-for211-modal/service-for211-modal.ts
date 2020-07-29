import { Component, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams,
         ViewController, Events, ModalController,
         ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { OneClickServiceModel } from "../../../models/one-click-service";
import { ServiceModel } from "../../../models/service";
import { FeedbackModel } from "../../../models/feedback";
import { SearchResultModel } from "../../../models/search-result";

import { OneClickProvider } from '../../../providers/one-click/one-click';
import { AutocompleteResultsComponent } from "../../../components/autocomplete-results/autocomplete-results";

import { AuthProvider } from '../../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'service-for211-modal',
  templateUrl: 'service-for211-modal.html',
})
export class ServiceFor211ModalPage {

  service: ServiceModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public oneClick: OneClickProvider,
              public events: Events,
              public translate: TranslateService,
              private changeDetector: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private auth: AuthProvider) {

    // Pull the subject(service) and subject type out of the navParams
    this.service = this.navParams.data.service;
  }

  ionViewDidLoad() {
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  // submit() {
  //   let feedback = this.feedbackForm.value as FeedbackModel;
  //   this.prependSubject(feedback);
  //   this.unmaskData(feedback);
  //   this.events.publish("spinner:show");
  //   this.oneClick.createFeedback(feedback)
  //   .then((resp) => {
  //     this.events.publish("spinner:hide");
  //     this.viewCtrl.dismiss(resp);
  //   })
  //   .catch((err) => {
  //     this.events.publish("spinner:hide");
  //     this.viewCtrl.dismiss(err);
  //   });
  // }

}

// Exports a class method that builds a feedback modal. Pass in a ModalController,
// a ToastController, a TranslateService, and a hash containing an optional service object to be
// the subject of the feedback. Returns the modal, so that present() can be called on it.
export namespace ServiceFor211ModalPage {
  export function createModal(modalCtrl: ModalController,
                              toastCtrl: ToastController,
                              translate: TranslateService,
                              subjectData: {
                                service?: ServiceModel;
                              } = {}) {
    let serviceFor211Modal = modalCtrl.create(ServiceFor211ModalPage, subjectData);
    serviceFor211Modal.onDidDismiss(data => {
      if(data) {
        let toast = toastCtrl.create({
          message: (data.status === 200 ? translate.instant("lynx.pages.feedback.success_message") :
                                          translate.instant("lynx.pages.feedback.error_message")),
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      }
    })
    return serviceFor211Modal;
  }
}
