import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/post.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() comments!: Comment[];

  constructor() { }

  ngOnInit(): void {
  }

}
