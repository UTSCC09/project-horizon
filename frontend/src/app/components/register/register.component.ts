import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../app.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit(): void {

  }

  onSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);

    this.api.signUp(formData as any).subscribe(
      (data) => {
        console.log(data);
      }
    );
  }
}
