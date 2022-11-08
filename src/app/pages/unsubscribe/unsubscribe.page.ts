import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.page.html',
  styleUrls: ['./unsubscribe.page.scss'],
})
export class UnsubscribePage implements OnInit {

  email: string;
  unsubscribed: Boolean = null;

  constructor(public route: ActivatedRoute,
              public oneClick: OneClickService,
              private loader: LoaderService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.email = params.get('email'); 
    });
    
    // On load, show the spinner
    this.loader.showLoader();
    
    // Attempt to unsubscribe the user. If successful, hide the spinner and show a success message
    // If unsuccessful, will re-route to home page with an error message.
    this.oneClick.unsubscribeUser(this.email)
        .subscribe(
        (resp) => this.unsubscribed = resp,
        (error) => {},
        () => this.loader.hideLoader()
        );
  }

}
