import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User, UserPost } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private apiService: ApiService,
    private messageService: MessageService,
  ) {
    const userId = this.router.url.split('/')[2];

    if (userId === 'me') {
      this.user = this.userService.user as User;
      this.apiService.getUserPosts(this.user.id).subscribe(({ data }) => {
        this.user.posts = (data as any).getUserPosts;
      }, (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
    } else if (parseInt(userId) > 0) {
      this.apiService.getUser(parseInt(userId))
        .subscribe(({ data }) => {
          let user: User = JSON.parse(JSON.stringify((data as any).user));
          delete user.posts;
          let posts = (data as any).user.posts?.map((post: UserPost) => {
            return {
              ...post,
              user
            }
          });
          this.user = user;
          this.user.posts = posts;
        }, (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
            });
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not found' });
      this.router.navigate(['/']);
    }

    this.user = this.userService.user as User;
  }

  ngOnInit() {
  }

}
