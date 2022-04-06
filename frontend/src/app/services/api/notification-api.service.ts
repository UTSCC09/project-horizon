import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Subject, Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { GraphQLErrors, NetworkError } from '@apollo/client/errors';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService extends BaseApiService implements OnDestroy {
  private querySubscription!: Subscription;
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

  get notification() {
    return this._notification;
  }

  init() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: this.NOTIFICATION_QUERY,
      pollInterval: 500,
    })
      .valueChanges
      .subscribe(
        (data) => {
          this._notification.next(data);
        },
        this.defaultErrorHandler.bind(this)
      );
  }

  override handleError(graphQLErrors: GraphQLErrors, networkError: NetworkError) {
    if ((networkError as any)?.statusCode) {
      console.log({ networkError });
      this.init();
    }
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this._notification.complete();
  }
}
