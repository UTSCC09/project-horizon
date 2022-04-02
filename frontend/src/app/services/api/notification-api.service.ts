import { Injectable, OnDestroy } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Subject, Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService extends BaseApiService implements OnDestroy {
  private querySubscription: Subscription;
  private _notification: Subject<any> = new Subject<any>();

  NOTIFICATION_QUERY = gql`
    query notifications {
      notifications {
        type
        sourceId
        payload
        createdAt
      }
    }
  `;

  constructor(apollo: Apollo) {
    super(apollo);

    this.querySubscription = this.apollo.watchQuery<any>({
      query: this.NOTIFICATION_QUERY,
      fetchPolicy: 'network-only',
      pollInterval: 500,
    })
      .valueChanges
      .subscribe((data) => {
        this._notification.next(data);
      });
  }

  get notification() {
    return this._notification;
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this._notification.complete();
  }
}
