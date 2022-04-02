import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Type } from '../models/notification.model';
import { NotificationApiService } from './api/notification-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationHandlers = {
    [Type.COMMENT]: this.handleComment.bind(this),
    [Type.LIKE]: this.handleLike.bind(this),
    [Type.FOLLOW]: this.handleFollow.bind(this),
    [Type.POST_LIKE]: this.handlePostLike.bind(this),
  }

  constructor(
    private subscriber: NotificationApiService,
    private messageService: MessageService
  ) {
    this.subscriber.notification.subscribe(({ data }) => {
      const notification = JSON.parse(JSON.stringify(data.notifications));
      notification.payload = JSON.parse(notification.payload);

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

  handleComment(data: any) {
    const user = data.payload.user;
    const message: string = `${user.firstName} ${user.lastName} commented on your post`;

    this.messageService.add({
      life: 7000,
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
      life: 7000,
      severity: 'success',
      summary: 'New Like',
      detail: message,
    });
  }

  handlePostLike(data: any) {
    const user = data.payload.user;
    const post = data.payload.post;

    const message: string = `${user.firstName} ${user.lastName} liked your post`;
    this.messageService.add({
      life: 7000,
      severity: 'success',
      summary: 'New Like',
      detail: message,
    });
  }

  handleFollow(data: any) {
    const user = data.payload.user;
    const message: string = `${user.firstName} ${user.lastName} is now following you`;
    this.messageService.add({
      severity: 'success', summary: 'New Follower', detail: message,
      life: 7000,
      data: {
        link: {
          url: `/profile/${user.id}`,
          label: 'Click here to see'
        }
      }
    });
  }
}
