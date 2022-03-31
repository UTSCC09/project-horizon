import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CommentApiService extends BaseApiService {
  addComment(postId: number, text: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createComment($postId: Float!, $text: String!) {
          createComment(postId: $postId, text: $text) {
            id
            text
            createdAt
          }
        }
      `,
      variables: {
        postId,
        text,
      },
    });
  }
}
