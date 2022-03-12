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
            token
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
            token
          }
        }
      `,
      variables: {
        data: {
          email: form.value.email,
          password: form.value.password,
          firstName: form.value.firstName,
          lastName: form.value.lastName
        }
      }
    });
  }

  upload(form: FormGroup) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($file: Upload!) {
          upload(file: $file) {
            id
            filename
            mimetype
            encoding
            createdAt
            user {
              id
            }
          }
        }
      `,
      variables: {
        file: form.value.file
      }
    });
  }

  post(form: FormGroup) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($content: String!) {
          createPost(content: $content) {
            id
            content
            createdAt
            user {
              id
            }
          }
        }
      `,
      variables: {
        content: form.value.content,
      }
    });
  }

}
