import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User, UserPost, Comment } from 'src/app/models/post.model';
import { PostApiService } from 'src/app/services/api/post-api.service';
import { UserApiService } from 'src/app/services/api/user-api.service';
import { NotificationService } from 'src/app/services/notification.service';
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
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    const user = this.userService.user;
    if (!user) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you are logged in' });
      return;
    }

    this.messageService.add({ severity: 'error', sticky: true, summary: 'Error', detail: 'Please make sure you are logged in' });
    this.getUserPosts();
  }

  getUserPosts(page: number = 0, limit: number = 1) {
    this.postApi.getFeed(page, limit)
      .subscribe(({ data }) => {
        this.userPosts = JSON.parse(JSON.stringify((data as any).feed))
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
