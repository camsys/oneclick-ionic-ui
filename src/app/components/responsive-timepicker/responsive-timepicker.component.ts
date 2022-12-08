import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { appConfig } from 'deploy/211ride/appConfig-211ride';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'responsive-timepicker',
  templateUrl: './responsive-timepicker.component.html',
  styleUrls: ['./responsive-timepicker.component.scss'],
})
export class ResponsiveTimepickerComponent implements OnInit {

  // Component accepts a date input to initialize it. Defaults to the current date and time.
  @Input() time: string = this.helpers.dateISOStringWithTimeZoneOffset(new Date());
  @Input() locale: string = appConfig.DEFAULT_LOCALE;

  // Emits output events whenever the date changes.
  @Output() change = new EventEmitter<string>();

  times: any[] = []; // For holding list of available times.

  constructor(/*private nativeDatePicker: DatePicker,*/
              public platform: Platform,
              public helpers: HelpersService) { }

  ngOnInit() {
    // Set list of available times to 15-min increments.
    this.times = this.helpers.getTimesArray(new Date(this.helpers.dateISOStringWithTimeZoneOffset(new Date())), 15);
  }


  // Whenever the time is changed, emit a change event with the new value.
  timeChange(e) {
    this.change.emit(e.detail.value);
  }

  // Compares date objects to minute-level precision. Assumes same month and year.
  compareTimes(t1, t2): boolean {
    t1 = new Date(t1); // Convert t1 to a date object (t2 already is one)
    return (
      t1.getDate() === t2.getDate() &&
      t1.getHours() === t2.getHours() &&
      t1.getMinutes() === t2.getMinutes()
    )
  }

}
