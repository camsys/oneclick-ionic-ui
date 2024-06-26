import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { SearchResultModel } from 'src/app/models/search-result';

@Component({
  selector: 'autocomplete-results',
  templateUrl: './autocomplete-results.component.html',
  styleUrls: ['./autocomplete-results.component.scss'],
})
export class AutocompleteResultsComponent implements OnInit {

  ngOnInit() {}

  // Index of the item currently focused on.
  focusIndex: number = null;

  @Input() uniqueId: string;
  @Input() hidden: Boolean = true; // Hide results list by default
  @Input() items: SearchResultModel[] = []; // Autocomplete items list

  // Output event emitters for setting callbacks outside of the component
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeFocus: EventEmitter<any> = new EventEmitter<any>();

  // Listener for keypresses, to move focus from one item to another
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if(this.isFocused()) {
      if(event.code === "ArrowDown") {
        this.focusOnNextItem(); // Go to next item on down arrow
        this.onChangeFocus.emit(this.uniqueId+'-item'+this.focusIndex);
      } else if (event.code === "ArrowUp") {
        this.focusOnPreviousItem(); // Go to previous item on up arrow
        this.onChangeFocus.emit(this.uniqueId+'-item'+this.focusIndex);
      } else if (event.code === "Enter") {
        this.selectFocusItem(); // On space or enter, select the focused item
      }
    }

  }

  constructor(public el: ElementRef) { }

  // Sets hidden to false, showing results list
  show() {
    this.hidden = false;
  }

  // Sets hidden to true, hiding results list
  hide() {
    this.hidden = true;
  }

  // Applies focus to the list, defaulting to right before the first item
  focus() {
    this.show();
    if(!this.isFocused()) {
      this.focusIndex = -1;
      this.onFocus.emit();
    }
  }

  // Unfocuses from any item on the list
  blur() {
    if(this.isFocused()) {
      this.focusIndex = null;
      this.onBlur.emit();
    }
  }

  // When an item is selected, emit the onSelect event, passing the selected item.
  selectItem(item: any, event?): any {
    if(event) {
      event.stopPropagation();
    }
    this.onSelect.emit(item);
  }

  // Selects the focused item if it's in the range of the items list
  selectFocusItem() {
    if(this.focusIndex >= 0 && this.focusIndex < this.items.length) {
      this.selectItem(this.items[this.focusIndex]);
    }
  }

  // Returns true if one of the items is focused on
  isFocused(): boolean {
    return this.focusIndex != null;
  }


  // Sets the focus to an item by index.
  // Focused item will be formatted differently.
  focusOnItem(index: number) {
    this.focusIndex = index;
  }

  // Focuses on the next item, stopping at the end of the list.
  focusOnNextItem() {
    this.focusIndex = Math.min(this.focusIndex + 1, this.items.length - 1);
  }

  // Focuses on the previous item. If you get to the beginning of the list,
  // unfocus from the element.
  focusOnPreviousItem() {
    this.focusIndex = this.focusIndex - 1;
    if(this.focusIndex < 0) {
      this.blur();
    }
  }

  // Determines if the item's title and label do not contain one another
  distinctTitleAndLabel(item: SearchResultModel): Boolean {
    return item.title &&
           item.label &&
           !(item.title === item.label) &&
           !this.similarStrings(item.title, item.label);
  }

  // If more than three words overlap, the two strings are considered similar
  similarStrings(str1:String, str2:String): Boolean {
    let words1 = str1.split(/[\s,]+/);
    let words2 = str2.split(/[\s,]+/);
    return words1.filter((w) => words2.indexOf(w) >= 0).length >= 3; // If more than 3 words overlap, consider them the same
  }


}
