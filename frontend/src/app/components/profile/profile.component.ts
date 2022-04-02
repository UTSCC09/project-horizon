import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User, UserPost } from 'src/app/models/post.model';
import { UserApiService } from 'src/app/services/api/user-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  currentUser: User;
  loadingFollow = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private userApi: UserApiService,
  ) {
    this.user = this.userService.user as User;
    this.currentUser = this.userService.user as User;
  }

  ngOnInit() {
    let userId = this.router.url.split('/')[2];

    if (userId === 'me') {
      userId = "" + this.userService.user?.id;
    }

    if (parseInt(userId) > 0) {
      this.userApi.getUser(parseInt(userId))
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
          this.user.posts = JSON.parse(JSON.stringify(posts));
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
  }

  followOrUnfollow() {
    const errored = (err: any) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message
        });
        this.loadingFollow = false;
    }

    this.loadingFollow = true;
    if (this.user.isFollowing) {
      this.userApi.unfollowUser(this.user.id)
        .subscribe(() => {
          this.user.isFollowing = false;
          this.user.followers = this.user.followers?.filter(follower => follower.id !== this.currentUser.id);
          this.user.followersCount = (this.user.followersCount || 1) - 1;
          this.loadingFollow = false;
        }, errored);
    } else {
      this.userApi.followUser(this.user.id)
        .subscribe(() => {
          this.user.isFollowing = true;
          this.user.followers = this.user.followers?.concat([this.currentUser]);
          this.user.followersCount = (this.user.followersCount || 0) + 1;
          this.loadingFollow = false;
        }, errored);
    }
  }
}
