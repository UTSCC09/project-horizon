import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss', '../../app.component.scss']
})
export class SignInComponent {
  form: FormGroup;

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private router: Router
    ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    this.api.signIn(this.form).subscribe(
      ({data}: MutationResult) => {
        console.log(data.login.token)
        if (!data.login.token) {
          return this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login failed'
          });
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully logged in.'
        });
        localStorage.setItem('token', data.login.token);
        this.router.navigate(['/']);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        });
      }
    );
  }

}
