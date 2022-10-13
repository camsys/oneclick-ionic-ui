import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { ResponsiveDatepickerComponent } from './responsive-datepicker/responsive-datepicker.component';
import { AutocompleteResultsComponent } from './autocomplete-results/autocomplete-results.component';
import { ResponsiveTimepickerComponent } from './responsive-timepicker/responsive-timepicker.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        TranslateModule
    ],
    declarations: [
        AppNavbarComponent,
        PlaceSearchComponent,
        ResponsiveDatepickerComponent,
        ResponsiveTimepickerComponent,
        AutocompleteResultsComponent
    ],
    exports: [
        AppNavbarComponent,
        PlaceSearchComponent,
        ResponsiveDatepickerComponent,
        ResponsiveTimepickerComponent,
        AutocompleteResultsComponent
    ],
    entryComponents: []
})
export class ComponentsModule {
}
