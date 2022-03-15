import { Injectable, OnInit } from '@angular/core';
import { Nullable } from '../models/utils.model';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  private _user: Nullable<User>;

  ngOnInit(): void {
    localStorage.getItem('user');
  }

  constructor() {
    this._user = null;
  }

  get isLoggedIn(): boolean {
    return !!this._user?.id;
  }

  setUser(user: User) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
