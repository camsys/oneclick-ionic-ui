import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { appConfig } from '../../../environments/appConfig';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'responsive-timepicker-minimal',
  templateUrl: './responsive-timepicker-minimal.component.html',
  styleUrls: ['./responsive-timepicker-minimal.component.scss'],
})
export class ResponsiveTimepickerMinimalComponent implements OnInit {
  private pattern = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/;

  // Component accepts a date input to initialize it. Defaults to the current date and time.
  private _time:string = this.helpers.dateISOStringWithTimeZoneOffset(new Date());

  @Input() 
  set time(timeString:string) {
    if (timeString) {
      this._time = timeString;
      this.setTimeControls(new Date(this._time));
    }
    else {
      this._time = this.helpers.dateISOStringWithTimeZoneOffset(new Date());
      this.setTimeControls(new Date(this._time));
    }
  }
  @Input() locale: string = appConfig.DEFAULT_LOCALE;

  // Emits output events whenever the date changes.
  @Output('changeTime') change = new EventEmitter<string>();


  hourControl: FormControl = new FormControl();
  minControl: FormControl = new FormControl();
  ampmControl: FormControl = new FormControl();

  constructor(/*private nativeDatePicker: DatePicker,*/
              public platform: Platform,
              public helpers: HelpersService) { }

  ngOnInit() {

    //initialize the time entry input controls
    //this.setTimeControls(new Date(this.time));
    //this.timeControl.setValue(tempDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));


    //TODO: validate and if valid emit new time

    this.hourControl.valueChanges.subscribe(
      value => {
        let hours = parseInt(value)
        if (hours <= 12 && hours >= 1) {
          let tempDate = new Date(this._time);
          let ampm = this.ampmControl.value;
          tempDate.setHours(ampm == "AM" ? hours : hours + 12);
          this._time = this.helpers.dateISOStringWithTimeZoneOffset(tempDate);
          this.outputUpdatedDate(this.helpers.dateISOStringWithTimeZoneOffset(tempDate));
        }
        else this.outputUpdatedDate(null);
      }
    );

    this.minControl.valueChanges.subscribe(
      value => {
        let min = parseInt(value)
        if (min <= 59 && min >= 0) {
          let tempDate = new Date(this._time);
          tempDate.setMinutes(min);
          this._time = this.helpers.dateISOStringWithTimeZoneOffset(tempDate);
          this.outputUpdatedDate(this._time);
        }
        else this.outputUpdatedDate(null);
      }
    );

    this.ampmControl.valueChanges.subscribe(
      value => {
        let tempDate = new Date (this._time);
        let h = tempDate.getHours();
        if (value == "AM" && h >= 12) tempDate.setHours(h - 12);
        else if (value == "PM" && h < 12) tempDate.setHours(h + 12);

        this._time = this.helpers.dateISOStringWithTimeZoneOffset(tempDate);
        this.outputUpdatedDate(this._time);
      }
    );
  }

  setTimeControls(tempDate:Date) {
    let hoursString: string;
    let minString: string;
    let hours:number = tempDate.getHours();
    let minutes:number = tempDate.getMinutes();
    let ampm = 'AM';
    if (hours >= 12) {//must be pm
      ampm = 'PM'
      if (hours > 12) hours = hours - 12;//move 13-23 back to 1-11
    }

    if (hours < 10) {
      if (hours == 0) hoursString = "12";//move 0 to 12
      else hoursString = '0' + hours.toString();//prepend 0 to 1-9 hours
    }
    else hoursString = hours.toString();

    if (minutes < 10) minString = '0' + minutes.toString();
    else minString = minutes.toString();

    this.hourControl.setValue(hoursString);
    this.minControl.setValue(minString);
    this.ampmControl.setValue(ampm);

  }

  outputUpdatedDate(newDateString: string) {
    this.change.emit(newDateString);
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
