import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-language-selector-modal',
  templateUrl: './language-selector-modal.page.html',
  styleUrls: ['./language-selector-modal.page.scss'],
})
export class LanguageSelectorModalPage implements OnInit {

  locale: string = null; // Selected locale
  available_locales: string[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController
              ) {

    // Include all available locales (including translation keys)
    // TODO: Set this to filter out keys locale unless admin user is logged in.
    this.available_locales = environment.AVAILABLE_LOCALES;

  }

  // Set the selected locale based on the passed nav params
  ngOnInit() {
    this.locale = this.navParams.data.locale;
  }

  // Dismiss the modal with the selected locale as data returned
  submit() {
    this.viewCtrl.dismiss(this.locale);
  }

  // Dismiss the modal without the selected locale returned as data
  cancel() {
    this.viewCtrl.dismiss(null);
  }

  // Submit the modal automatically when a new locale is selected
  onLocaleChange() {
    this.submit();
  }


}
