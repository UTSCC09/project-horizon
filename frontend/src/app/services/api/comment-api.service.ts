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

  likeComment(commentId: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation likeComment($commentId: Float!) {
          likeComment(commentId: $commentId) {
            id
          }
        }
      `,
      variables: {
        commentId,
      },
    });
  }

  unlikeComment(commentId: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation unlikeComment($commentId: Float!) {
          unlikeComment(commentId: $commentId) {
            id
          }
        }
      `,
      variables: {
        commentId,
      },
    });
  }

}
