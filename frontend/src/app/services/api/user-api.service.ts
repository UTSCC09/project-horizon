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
          }
        }
      `,
      variables: {
        userId
      }
    });
  }

  searchUser(query: string) {
    return this.apollo.query({
      query: gql`
        query($query: String!) {
          search(query: $query) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: {
        query
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
