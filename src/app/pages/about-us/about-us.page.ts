import { Component, OnInit } from '@angular/core';
import { AgencyModel } from 'src/app/models/agency';
import { HelpersService } from 'src/app/services/helpers.service';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  agencies: AgencyModel[];
  
  constructor(private oneClickProvider: OneClickService,
    public helpers: HelpersService) {
  }
  
  ngOnInit() {
    this.oneClickProvider.getPartnerAgencies()
      .then(agencies => this.agencies = agencies);
  }
}
