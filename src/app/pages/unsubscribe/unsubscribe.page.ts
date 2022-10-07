import { Component, OnInit } from '@angular/core';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.page.html',
  styleUrls: ['./unsubscribe.page.scss'],
})
export class UnsubscribePage implements OnInit {

  email: string;
  unsubscribed: Boolean = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public oneClick: OneClickService,
              public events: Events) {
    this.email = navParams.data.email;
  }

  ngOnInit() {
    
    // On load, show the spinner
    this.events.publish("spinner:show");
    
    // Attempt to unsubscribe the user. If successful, hide the spinner and show a success message
    // If unsuccessful, will re-route to home page with an error message.
    this.oneClick.unsubscribeUser(this.email)
        .subscribe((resp) => {
          this.events.publish("spinner:hide");
          this.unsubscribed = resp;
        })
  }

}
