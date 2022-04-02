import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User, UserPost, Comment } from 'src/app/models/post.model';
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
  public posts: UserPost[] = [];

  constructor(
    public dialogService: DialogService,
    private postApi: PostApiService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
   this.getFeed();
  }

  getFeed() {
    this.postApi.getFeed()
      .subscribe(({ data }) => {
        this.posts = JSON.parse(JSON.stringify((data as any).feed))
      }, (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get posts' });
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
