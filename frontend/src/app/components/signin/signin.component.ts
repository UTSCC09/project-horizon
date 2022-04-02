import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { AuthApiService } from 'src/app/services/api/auth-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../app.component.scss']
})
export class SignInComponent {
  form: FormGroup;

  constructor(
    private api: AuthApiService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    this.api.signIn(this.form).subscribe(
      ({ data }: MutationResult) => {
        if (!data.login.user) {
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

        this.userService.setUser(data.login.user);

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
