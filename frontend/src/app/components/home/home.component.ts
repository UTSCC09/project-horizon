import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User, UserPost } from 'src/app/models/post.model';
import { PostApiService } from 'src/app/services/api/post-api.service';
import { UserApiService } from 'src/app/services/api/user-api.service';
import { UserService } from 'src/app/services/user.service';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../app.component.scss']
})
export class HomeComponent implements OnInit {
  public userPosts: UserPost[] = [];

  constructor(
    public dialogService: DialogService,
    private userApi: UserApiService,
    private postApi: PostApiService,
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    const user = this.userService.user;
    if (!user) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you are logged in' });
      return;
    }

   this.getUserPosts(user);
  }

  getUserPosts(user: User) {
    this.postApi.getUserPosts(user.id)
      .subscribe(({ data }) => {
        this.userPosts = (data as any).getUserPosts;
      });
  }

  showPostDialog() {
    this.dialogService.open(UploadComponent, {
      header: 'Create Post',
      width: '90%',
      contentStyle: {
        'max-height': '90vh',
        overflow: 'auto'
      }
    });
  }
}
