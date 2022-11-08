import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-language-selector-modal',
  templateUrl: './language-selector-modal.page.html',
  styleUrls: ['./language-selector-modal.page.scss'],
})
export class LanguageSelectorModalPage implements OnInit {

  locale: string = null; // Selected locale
  available_locales: string[];
  radioLocaleControl: FormControl = new FormControl();

  constructor(public navParams: NavParams,
              private modalCtrl: ModalController
              ) {

    // Include all available locales (including translation keys)
    // TODO: Set this to filter out keys locale unless admin user is logged in.
    this.available_locales = environment.AVAILABLE_LOCALES;

  }

  // Set the selected locale based on the passed nav params
  ngOnInit() {
    this.locale = this.navParams.data.locale;

    this.radioLocaleControl.valueChanges.subscribe(
      (value:string) => {
        this.locale = value;
        this.onLocaleChange();
      }
    );
  }

  // Dismiss the modal with the selected locale as data returned
  async submit() {
    await this.modalCtrl.dismiss({locale: this.locale});
  }

  // Dismiss the modal without the selected locale returned as data
  async cancel() {
    await this.modalCtrl.dismiss(null);
  }

  // Submit the modal automatically when a new locale is selected
  onLocaleChange() {
    this.submit();
  }


}
