import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
