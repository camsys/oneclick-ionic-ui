import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private _menuIsOpen:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  get menuIsOpen() {
    return this._menuIsOpen.asObservable();
  }

  setMenuIsOpen(isOpen: boolean) {
    this._menuIsOpen.next(isOpen);
  }
}
