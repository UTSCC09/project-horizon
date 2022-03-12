import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss', '../../app.component.scss']
})
export class SignInComponent {
  form: FormGroup;
  api: ApiService;

  constructor(api: ApiService) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.api = api;
  }

  onSubmit() {
    this.api.signIn(this.form).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

}
