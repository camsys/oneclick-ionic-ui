import { Component, ContentChild, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @ContentChild(ElementRef) input: ElementRef;

  @Output() clear: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  processClear($event: KeyboardEvent) {
   if ($event.code === "Enter" || $event.code === "Space") {
      this.clear.emit();
    }
  }
}
