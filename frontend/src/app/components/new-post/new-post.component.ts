import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  constructor(
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
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
