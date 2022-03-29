import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApiService {

  getUser(userId: number) {
    return this.apollo.query({
      query: gql`
        query($userId: Float!) {
          user(id: $userId) {
            id
            firstName
            lastName
            email
            followersCount
            followingCount
            postsCount

            isFollowing

            followers {
              id
              firstName
              lastName
            }

            following {
              id
              firstName
              lastName
            }

            posts {
              id
              content
              createdAt

              files {
                id
                filename
                mimetype
                url
              }
            }
          }
        }
      `,
      variables: {
        userId
      }
    });
  }

  followUser(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($id: Float!) {
          followUser(userId: $id) {
            followersCount
            isFollowing

            followers {
              id
              firstName
              lastName
            }
          }
        }
      `,
      variables: {
        id
      }
    });
  }

  unfollowUser(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($id: Float!) {
          unfollowUser(userId: $id) {
            followersCount
            isFollowing

            followers {
              id
              firstName
              lastName
            }
          }
        }
      `,
      variables: {
        id
      }
    });
  }

}
