import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  onSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);

    this.api.signUp(formData as any).subscribe(
      (data: any) => {
        if (!data.register.id){
          return this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Registration failed'
          });
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully registered.'
        });
        this.router.navigate(['/signin']);
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
