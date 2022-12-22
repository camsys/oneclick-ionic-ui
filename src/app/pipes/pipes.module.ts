import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import { FormatPhoneNumberPipe } from './format-phone-number.pipe';
import { PrettyDistancePipe } from './pretty-distance.pipe';
import { PrettyFarePipe } from './pretty-fare.pipe';
import { PrettyTableNamePipe } from './pretty-table-name.pipe';
import { PrettyTimePipe } from './pretty-time.pipe';
import { ScheduleDayPipe } from './schedule-day.pipe';
import { ScheduleTimePipe } from './schedule-time.pipe';
import { ToStringPipe } from './to-string.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        FormatPhoneNumberPipe,
        PrettyDistancePipe,
        PrettyFarePipe,
        PrettyTableNamePipe,
        PrettyTimePipe,
        ScheduleDayPipe,
        ScheduleTimePipe,
        ToStringPipe
    ],
    exports: [
        FormatPhoneNumberPipe,
        PrettyDistancePipe,
        PrettyFarePipe,
        PrettyTableNamePipe,
        PrettyTimePipe,
        ScheduleDayPipe,
        ScheduleTimePipe,
        ToStringPipe
    ],
    entryComponents: []
})
export class PipesModule {
}
