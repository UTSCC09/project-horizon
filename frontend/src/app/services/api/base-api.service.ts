import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GraphQLErrors, NetworkError } from '@apollo/client/errors';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  constructor(
    public apollo: Apollo,
    private messageService: MessageService,
    private router: Router,
  ) { }

  defaultErrorHandler(error: any) {
    console.log('HANDLING DEFAULT',{error});

    error.graphQLErrors?.forEach((err: any) => {
      const extension = err?.extensions['exception'];

      if (extension?.status == 401 || err?.extensions?.response?.statusCode == 401) {
        this.authError();
      }
      else if (extension?.status < 502) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: extension.message });
      }
    });

    this.handleError(error.graphQLErrors, error.networkError);
  }

  handleError(graphQLErrors: GraphQLErrors, networkError: NetworkError)
  { }

  authError() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you are logged in' });
    this.router.navigate(['/login']);
  }
}
