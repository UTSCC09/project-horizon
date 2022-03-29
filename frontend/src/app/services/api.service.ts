import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private apollo: Apollo) { }

  signIn(form: FormGroup) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($data: LoginInfo!) {
          login(data: $data) {
            token,
            user {
              id
              firstName
              lastName
              email
            }
          }
        }
      `,
      variables: {
        data: form.value
      }
    });
  }

  signUp(form: FormGroup) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($data: UserInput!) {
          register(data: $data) {
            token,
            user {
              id
              firstName
              lastName
              email
            }
          }
        }
      `,
      variables: {
        data: form.value
      }
    });
  }

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

  getUserPosts(userId: number) {
    return this.apollo.query({
      query: gql`
        query($userId: Float!) {
          getUserPosts(userId: $userId) {
            id
            content
            createdAt
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

  getUser(userId: number) {
    return this.apollo.query({
      query: gql`
        query($userId: Float!) {
          user(id: $userId) {
            id
            firstName
            lastName
            email
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
}
