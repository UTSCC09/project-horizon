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
    [Type.COMMENT]: this.handleComment.bind(this),
    [Type.LIKE]: this.handleLike.bind(this),
    [Type.FOLLOW]: this.handleFollow.bind(this),
  }

  constructor(
    private subscriber: NotificationApiService,
    private messageService: MessageService
  ) {
    this.subscriber.notification.subscribe(({ data }) => {
      const notification = JSON.parse(JSON.stringify(data.notifications));
      notification.payload = JSON.parse(notification.payload);
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
    const user = data.payload.user;
    const comment = data.payload.comment;
    const message: string = `${user.firstName} ${user.lastName} commented on your post \n
      <a href="http://localhost:4200/profile/5">Click here to see</a>
    `;
    this.messageService.add({
      severity: 'success',
      summary: 'New Comment',
      detail: message,
    });
  }

  handleLike(data: any) {
    const user = data.payload.user;
    const comment = data.payload.comment;

    const message: string = `${user.firstName} ${user.lastName} liked your comment`;
    this.messageService.add({
      severity: 'success',
      summary: 'New Like',
      detail: message,
    });
  }

  handleFollow(data: any) {
    const user = data.payload.user;
    const message: string = `${user.firstName} ${user.lastName} is now following you`;
    this.messageService.add({
      severity: 'success', summary: 'New Follower', detail: message
    });
  }
}
