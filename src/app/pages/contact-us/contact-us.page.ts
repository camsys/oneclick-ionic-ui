import { Component, OnInit } from '@angular/core';
import { AgencyModel } from 'src/app/models/agency';
import { HelpersService } from 'src/app/services/helpers.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  static routePath:string = '/contact_us';

  constructor(private oneClickProvider: OneClickService,
    public helpers: HelpersService) {}

  agencies: AgencyModel[];

  ngOnInit() {
    this.oneClickProvider.getAllAgencies()
      .then(agencies => this.agencies = agencies);
  }

}
