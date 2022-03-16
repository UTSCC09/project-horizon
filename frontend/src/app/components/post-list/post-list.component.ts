import { Component, Input, OnInit } from '@angular/core';
import { UserPost } from 'src/app/models/user.model';
import { File } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  @Input() posts: UserPost[] = [];

  constructor() { }

}
