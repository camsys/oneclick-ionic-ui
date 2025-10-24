import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { HelpMeFindPage } from 'src/app/pages/help-me-find/help-me-find.page';
import { LanguageSelectorModalPage } from 'src/app/pages/language-selector-modal/language-selector-modal.page';
import { AuthService } from 'src/app/services/auth.service';
import { I18nService } from 'src/app/services/i18n.service';
import { MenuService } from 'src/app/services/menu.service';
import { OneClickService } from 'src/app/services/one-click.service';
import { appConfig } from 'src/environments/appConfig';

@Component({
  selector: 'app-alert',
  templateUrl: './app-alert.component.html',
  styleUrls: ['./app-alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  private unsubscribe:Subject<any> = new Subject<any>();

  showAlertMessage: boolean = false;//don't show anything until an alert message is found
  alertMessage: string;

  constructor(public oneClickService: OneClickService, public translate: TranslateService) {
    //prepare for language changes so that the alert can refresh
    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe((event: LangChangeEvent) => {
      this.updateAlertText();
    });
  }

  ngOnInit(): void {
    //load alert upon entering page
    this.updateAlertText();
  }

  private updateAlertText() {
    this.oneClickService.getAlerts().then(
      alerts => {
        if (!!alerts && alerts.length > 0) {
          this.alertMessage = alerts[0].message;
          this.showAlertMessage = true;
        }
        else this.showAlertMessage = false;
      },
      error => console.error('Error fetching alerts:', error)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
