import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class HomeComponent implements AfterContentInit {
  public userPosts: UserPost[] = [];
  private discover: boolean = false;
  loading: boolean = true;

  title: string = 'Your Feed';

  total: number = 0;
  page: number = 0;

  constructor(
    public dialogService: DialogService,
    private userApi: UserApiService,
    private postApi: PostApiService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngAfterContentInit(): void {
    const user = this.userService.user;
    if (!user) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you are logged in' });
      return;
    }

    if (this.router.url.includes('discover')) {
      this.discover = true;
      this.title = 'Discover';
    }

    this.updateFeed();
  }

  getFeed(page: number = 0, limit: number = 1) {
    this.postApi.getFeed(page, limit)
      .subscribe(({ data }) => {
        const { posts, total, page } = JSON.parse(JSON.stringify((data as any).feed));
        this.userPosts = posts;
        this.total = total;
        this.page = page;
        this.loading = false;
      });
  }

  getDiscover(page: number = 0, limit: number = 1) {
    this.postApi.getDiscover(page, limit)
      .subscribe(({ data }) => {
        const { posts, total, page } = JSON.parse(JSON.stringify((data as any).discover));
        this.userPosts = posts;
        this.total = total;
        this.page = page;
        this.loading = false;
      });
  }

  updateFeed(page: number = 0, limit: number = 1) {
    if (this.discover) {
      this.getDiscover(page, limit);
    } else {
      this.getFeed(page, limit);
    }
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
