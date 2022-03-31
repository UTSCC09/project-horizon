import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class PostApiService extends BaseApiService {
  upload(file: File, postId: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($file: Upload!, $postId: String!) {
          uploadFile(file: $file, postId: $postId) {
            id
            filename
            mimetype
            encoding
            createdAt
          }
        }
      `,
      variables: { file, postId },
      context: {
        useMultipart: true,
      }
    });
  }

  post(content: string, ...files: File[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($content: String!, $files: [Upload!]!) {
          createPost(content: $content, files: $files) {
            id
            content
            createdAt
          }
        }
      `,
      variables: {
        content,
        files
      },
      context: {
        useMultipart: true,
      }
    });
  }

  getPostFiles(postId: string) {
    return this.apollo.query({
      query: gql`
        query($postId: String!) {
          postFiles(postId: $postId) {
            id
            filename
            mimetype
          }
        }
      `,
      variables: { postId }
    });
  }

  getFeed() {
    return this.apollo.query({
      query: gql`
        query {
          feed {
            id
            content
            createdAt
            comments {
              id
              text
              createdAt
              user {
                id
                firstName
                lastName
              }
            }
            user {
              id
              firstName
              lastName
              email
            }
            files {
              id
              filename
              mimetype
              url
            }
          }
        }
      `,
    });
  }

  getUserPosts(userId: number) {
    return this.apollo.query({
      query: gql`
        query($userId: Float!) {
          getUserPosts(userId: $userId) {
            id
            content
            createdAt
            comments {
              id
              text
              createdAt
              user {
                id
                firstName
                lastName
              }
            }
            user {
              id
              firstName
              lastName
              email
            }
            files {
              id
              filename
              mimetype
              url
            }
          }
        }
        `,
      variables: {
        userId
      }
    })
  }
}
