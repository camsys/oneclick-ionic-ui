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
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { ParatransitServicesDetailComponent } from './paratransit-services-detail/paratransit-services-detail.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
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
        AutocompleteResultsComponent,
        SearchComponent,
        ShowHidePasswordComponent,
        ParatransitServicesDetailComponent
    ],
    exports: [
        AppNavbarComponent,
        ExternalLinkComponent,
        PlaceSearchComponent,
        ResponsiveDatepickerComponent,
        ResponsiveTimepickerComponent,
        ServiceDetailsComponent,
        AutocompleteResultsComponent,
        SearchComponent,
        ShowHidePasswordComponent,
        ParatransitServicesDetailComponent
    ]
})
export class ComponentsModule {
}
