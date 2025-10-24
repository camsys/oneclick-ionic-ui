import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { appVersion } from '../../../environments/version';
import {appConfig} from "../../../environments/appConfig";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  appVersion: string;
  helpUrl: string;
  contactUsUrl: string;

  constructor(public translate: TranslateService) {
    this.appVersion = appVersion.VERSION;
    this.helpUrl = appConfig.HELP_EXT_URL;
    this.contactUsUrl = "contact_us";
  }

  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
