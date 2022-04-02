import { Injectable, OnInit } from '@angular/core';
import { Nullable } from '../models/utils.model';
import { User } from '../models/post.model';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  private _user: Nullable<User>;


  ngOnInit(): void {
    this.checkUser();
  }

  constructor() {
    this._user = null;
  }

  get user(): User | null {
    return this._user;
  }

  get isLoggedIn(): boolean {
    this.checkUser();
    return !!this._user?.id;
  }

  checkUser() {
    if (this._user == null) {
      const user = localStorage.getItem('user');
      if (user) {
        this._user = JSON.parse(user);
      }
    }
  }

  setUser(user: User) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
