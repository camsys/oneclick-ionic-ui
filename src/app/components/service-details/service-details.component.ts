import { Component, Input, OnInit } from '@angular/core';
import { OneClickServiceModel } from 'src/app/models/one-click-service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit {

  @Input() service: OneClickServiceModel;

  constructor(public helpers: HelpersService) { }

  ngOnInit() {}

  purposeList(): string {
    return this.service.purposes.map((purp) => purp.name).join(', ');
  }
  
  eligibilityList(): string {
    return this.service.eligibilities.map((elig) => elig.name).join(', ');
  }
  
  accommodationList(): string {
    return this.service.accommodations.map((acc) => acc.name).join(', ');
  }


}
