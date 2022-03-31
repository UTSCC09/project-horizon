import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserPost, Comment } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  @Input() posts: UserPost[] = [];

  constructor() { }
}
