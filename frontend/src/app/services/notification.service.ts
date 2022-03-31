import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit {
  _notification: Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit() {

  }

  get notification() {
    return this._notification;
  }
}
