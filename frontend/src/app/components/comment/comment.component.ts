import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Comment } from 'src/app/models/post.model';
import { CommentApiService } from 'src/app/services/api/comment-api.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment!: Comment;

  constructor(
    private apiService: CommentApiService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
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
}
