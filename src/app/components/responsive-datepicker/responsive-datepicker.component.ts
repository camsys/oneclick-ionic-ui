import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { appConfig } from '../../../environments/appConfig';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'responsive-datepicker',
  templateUrl: './responsive-datepicker.component.html',
  styleUrls: ['./responsive-datepicker.component.scss'],
})
export class ResponsiveDatepickerComponent implements OnInit {
  private pattern = /^(0[1-9]|1[012]|[1-9])[- /.]([1-9]|0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;

  // Reference the ionic datepicker element (only used in browsers)
  //@ViewChild('browserDatepicker') browserDatepicker: any;

  // Component accepts a date input to initialize it. Defaults to the current date and time.
  @Input() date: string = this.helpers.dateISOStringWithTimeZoneOffset(new Date());
  @Input() locale: string = appConfig.DEFAULT_LOCALE;

  // Emits output events whenever the date changes.
  @Output('changeDate') change = new EventEmitter<string>();

  dateControl: FormControl = new FormControl();

  constructor(/*private nativeDatePicker: DatePicker,*/
              public helpers: HelpersService) {
  }

  ngOnInit() {
    //initialize the date entry input control
    let tempDate = new Date(this.date);
    this.dateControl.setValue(tempDate.toLocaleDateString("en-US"));

    this.dateControl.valueChanges.subscribe(
      (value: string) => {
        //check entered user string to be sure it is a match
        let isValid = value.match(this.pattern);

        if (isValid) {
          //let tempDate = new Date(value);

          this.outputUpdatedDate(this.helpers.dateISOStringWithTimeZoneOffset(new Date(value)));
        }
        else this.outputUpdatedDate(null)
      }
    );
  }

  outputUpdatedDate(newDateString: string) {
    this.change.emit(newDateString);
  }


  // Shows the datepicker.
  //open() {
    // Wait for platform to be ready...
    //this.platform.ready()
    //.then(() => {
      // ...then check if we're actually on a mobile device (as opposed to browser)
      // to determine which datepicker to open.
      //if(this.platform.is('cordova')) {
      //  this.openNativeDatepicker();
      //} else {
       // this.openBrowserDatepicker();
      //}

    //})
  //}

  // Opens the native datepicker in ios or android, or defaults to the ionic datepicker in windows.
  // openNativeDatepicker() {
  //   let oldDate = new Date(this.date);

  //   if(this.platform.is('android') || this.platform.is('ios')) {
  //     this.nativeDatePicker.show({
  //       date: oldDate,
  //       mode: 'date',
  //       androidTheme: this.nativeDatePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //     }).then(
  //       (date) => {
  //         let newDate = date;
  //         newDate.setHours(oldDate.getHours());
  //         newDate.setMinutes(oldDate.getMinutes());
  //         this.date = this.helpers.dateISOStringWithTimeZoneOffset(newDate);
  //         this.dateChange();
  //       },
  //       (err) => {
  //         console.error('Error occurred while getting date: ', err);
  //       }
  //     );
  //   } else { // if not ios or android, open ionic datepicker
  //     this.openBrowserDatepicker();
  //   }
  // }

  // Opens the ionic datepicker.
  // openBrowserDatepicker() {
  //   this.browserDatepicker.open();
  // }

  // Whenever the date is changed, emit a change event with the new value.
  datePickerChangeEvent(e) {
    //update the input control for date to reflect the picker choice
    let tempDate = new Date(e.detail.value);
    //this.date = this.helpers.dateISOStringWithTimeZoneOffset(tempDate);
    this.dateControl.setValue(tempDate.toLocaleDateString("en-US"));
  }

  // Gets a list of the next few years for populating the datepicker
  yearValues() {
    return this.helpers.getYearsArray(5).join(",");
  }


}
