import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { ResponsiveDatepickerComponent } from './responsive-datepicker/responsive-datepicker.component';
import { AutocompleteResultsComponent } from './autocomplete-results/autocomplete-results.component';
import { ResponsiveTimepickerComponent } from './responsive-timepicker/responsive-timepicker.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        PipesModule,
        SharedModule
    ],
    declarations: [
        AppNavbarComponent,
        ExternalLinkComponent,
        PlaceSearchComponent,
        ResponsiveDatepickerComponent,
        ResponsiveTimepickerComponent,
        ServiceDetailsComponent,
        AutocompleteResultsComponent
    ],
    exports: [
        AppNavbarComponent,
        ExternalLinkComponent,
        PlaceSearchComponent,
        ResponsiveDatepickerComponent,
        ResponsiveTimepickerComponent,
        ServiceDetailsComponent,
        AutocompleteResultsComponent
    ]
})
export class ComponentsModule {
}
