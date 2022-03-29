import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { gql } from 'apollo-angular';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends BaseApiService {

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

}
