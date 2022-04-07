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
  private errorCount: number = 0;

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
      fetchPolicy: 'network-only',
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
    this.errorCount++;
    if (this.errorCount < 5 &&
        ((networkError as any)?.statusCode != undefined || (networkError as any)?.status != undefined)) {
      this.init();
    }
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this._notification.complete();
  }
}
