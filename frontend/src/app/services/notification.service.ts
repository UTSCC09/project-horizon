import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Type } from '../models/notification.model';
import { NotificationApiService } from './api/notification-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private _notification: Subject<any> = new Subject<any>();
  private notificationHandlers = {
    [Type.COMMENT]: this.handleComment,
    [Type.LIKE]: this.handleLike,
    [Type.FOLLOW]: this.handleFollow,
  }

  constructor(
    private subscriber: NotificationApiService,
    private messageService: MessageService
  ) {

    this.subscriber.notification.subscribe(({ data }) => {
      const notification = data.notifications;
      this._notification.next(notification);

      if (Object.values(Type).includes(notification.type)) {
        const type: Type = notification.type as Type;
        const handler = this.notificationHandlers[type];
        handler(notification);
      }
    },
    (error) => {
      console.log("ERROR", { error })
    });
  }

  get notification() {
    return this._notification;
  }

  ngOnDestroy() {
    this._notification.complete();
  }

  handleComment(data: any) {
    console.log("HANDLE COMMENT", { data })
  }

  handleLike(data: any) {
    console.log("HANDLE LIKE", { data })
  }

  handleFollow(data: any) {
    console.log("HANDLE FOLLOW", { data })
  }
}
