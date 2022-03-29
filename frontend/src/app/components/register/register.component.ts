import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthApiService } from 'src/app/services/api/auth-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private api: AuthApiService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {

  }

  onSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = {
      value: {
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
      }
    }

    this.api.signUp(form as any).subscribe(
      ({ data }: any) => {
        if (!data.register.user){
          return this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Registration failed'
          });
        }

        this.userService.setUser(data.register.user);
        localStorage.setItem('token', data.register.token);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully registered.'
        });
        this.router.navigate(['']);
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
