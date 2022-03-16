import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User, UserPost } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
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
    private apiService: ApiService,
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
    this.apiService.getUserPosts(user.id)
      .subscribe(({ data }) => {
        (data as any).getUserPosts.forEach((post: any, i: any) => {
          this.apiService.getPostFiles(post.id)
            .subscribe(({ data }) => {
              const files: File[] = (data as any).postFiles;
              this.userPosts[i] = {
                ...post,
                files
              };
            });
        });
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
