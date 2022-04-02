import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Comment, User } from 'src/app/models/post.model';
import { CommentApiService } from 'src/app/services/api/comment-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment!: Comment;
  private user: User | null;

  constructor(
    private apiService: CommentApiService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.user = this.userService.user;
  }

  likeUnlike() {
    const updateComment = ({data}: any) => {
      this.comment.liked = !this.comment.liked;
    };

    const errored = (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }

    if (this.comment.liked) {
      this.apiService.unlikeComment(this.comment.id)
        .subscribe(updateComment, errored);
    } else {
      this.apiService.likeComment(this.comment.id)
        .subscribe(updateComment, errored);
    }
  }

  date(date: string) {
    return new Date(date);
  }

  isMe() {
    // console.log({user: this.user, comment: this.comment});
    return this.comment.user.id === this.user?.id;
  }
}
