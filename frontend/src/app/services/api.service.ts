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

}
