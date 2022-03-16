import { Component, Input, OnInit } from '@angular/core';
import { UserPost } from 'src/app/models/user.model';
import { File } from 'src/app/models/user.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  @Input() posts: UserPost[] = [];

  constructor() { }

  filePath(file: File) {
    return `.uploads/${file.id}.${this.fileType(file)}`;
  }

  fileType(file: File) {
    return file.filename.split('.').pop();
  }
}
