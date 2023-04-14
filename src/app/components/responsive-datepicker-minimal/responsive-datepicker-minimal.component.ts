import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { appConfig } from '../../../environments/appConfig';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'responsive-datepicker-minimal',
  templateUrl: './responsive-datepicker-minimal.component.html',
  styleUrls: ['./responsive-datepicker-minimal.component.scss'],
})
export class ResponsiveDatepickerMinimalComponent implements OnInit {
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

}
