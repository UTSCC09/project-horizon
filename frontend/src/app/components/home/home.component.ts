import { AfterContentInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserPost } from 'src/app/models/post.model';
import { PostApiService } from 'src/app/services/api/post-api.service';
import { UserApiService } from 'src/app/services/api/user-api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';


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
  limit: number = 10;

  constructor(
    private postApi: PostApiService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
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

  getFeed(page: number = 0, limit: number = 10) {
    this.postApi.getFeed(page, limit)
      .subscribe(({ data }) => {
        const { posts, total, page, limit } = JSON.parse(JSON.stringify((data as any).feed));
        this.userPosts = posts;
        this.total = total;
        this.page = page;
        this.loading = false;
        this.limit = limit;
      });
  }

  getDiscover(page: number = 0, limit: number = 10) {
    this.postApi.getDiscover(page, limit)
      .subscribe(({ data }) => {
        const { posts, total, page, limit } = JSON.parse(JSON.stringify((data as any).discover));
        this.userPosts = posts;
        this.total = total;
        this.page = page;
        this.loading = false;
        this.limit = limit;
      });
  }

  updateFeed(page: number = 0, limit: number = 10) {
    if (this.discover) {
      this.getDiscover(page, limit);
    } else {
      this.getFeed(page, limit);
    }
  }
}
