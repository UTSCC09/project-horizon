import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserPost, Comment } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
  @Input() posts: UserPost[] = [];
  @Output() getPage = new EventEmitter();

  userPosts: UserPost[] = [];
  totalRecords: number = 200;

  constructor() { }

  loadPage(e: any) {
    console.log({ emit: e.first })
    this.getPage.emit(e.first);
  }
}
