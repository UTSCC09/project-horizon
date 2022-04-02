import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class PostApiService extends BaseApiService {
  private POST_CONTENT: string = `
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
  `;

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

  getFeed(page: number, limit: number = 25) {
    return this.apollo.query({
      query: gql`
        query($page: Float!, $limit: Float!) {
          feed(page: $page, limit: $limit) {
            posts {
              ${this.POST_CONTENT}
            }
            total
            page
            limit
          }
        }
      `,
      variables: { page, limit }
    });
  }

  getDiscover(page: number, limit: number) {
    return this.apollo.query({
      query: gql`
        query($page: Float!, $limit: Float!) {
          discover(page: $page, limit: $limit) {
            posts {
              ${this.POST_CONTENT}
            }
            total
            page
            limit
          }
        }
      `,
      variables: { page, limit }
    });
  }

  getUserPosts(userId: number, page: number, limit: number) {
    return this.apollo.query({
      query: gql`
        query($userId: Float!, $page: Float!, $limit: Float!) {
          getUserPosts(userId: $userId, page: $page, limit: $limit) {
            posts {
              ${this.POST_CONTENT}
            }
            total
            page
            limit
          }
        }
        `,
      variables: {
        userId,
        page,
        limit,
      }
    })
  }
}
