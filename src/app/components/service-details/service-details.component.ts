import { Component, Input, OnInit } from '@angular/core';
import { OneClickServiceModel } from 'src/app/models/one-click-service';
import { HelpersService } from 'src/app/services/helpers.service';
import {appConfig} from "../../../environments/appConfig";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit {

  @Input() service: OneClickServiceModel;

  constructor(public helpers: HelpersService) {
  }

  ngOnInit() {}

  showFareCost(): boolean {
    if (!appConfig.INCLUDE_FARE_COST || !this.service ||
      !this.service.fare_text ||
      this.service.fare_text.includes("missing key"))
        return false;

    return true;
  }

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
