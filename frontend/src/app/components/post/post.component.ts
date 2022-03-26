import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserPost } from 'src/app/models/user.model';
import { File } from 'src/app/models/user.model';
import { EngineService } from 'src/app/services/engine.service';
import { environment } from 'src/environments/environment';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post!: UserPost;
  private engineService: EngineService;

  renderEngine: boolean = false;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    this.engineService = new EngineService();
  }

  get snapshot() {
    return this.post?.files?.filter(file => this.isImage(file))[0];
  }

  get stl() {
    return this.post?.files?.filter(file => file.mimetype === 'application/octet-stream')[0];
  }


  ngOnInit(): void {

  }

  fileUrl(file?: File) {
    if (!file) {
      return '';
    }

    return `${environment.apiUrl}/${file.url}`;
  }

  fileType(file: File): string {
    return file.filename.split('.').pop() || '';
  }

  isImage(file: File): boolean {
    return file.mimetype.startsWith('image');
  }

  setupRenderer() {
    this.renderEngine = true;
    this.canvas.nativeElement.classList.remove('hidden');

    this.engineService.createScene(this.canvas);
    this.engineService.animate();
    fetch(this.fileUrl(this.stl))
      .then(res => res.blob())
      .then(async blob => {
        const file = new File([blob], this.stl?.filename || '', { type: 'application/octet-stream' });
        // load file contents
        const geometry = this.engineService.parseSTL(await file.arrayBuffer());
        const mesh = this.engineService.createFileMesh(geometry);

        this.engineService.addMeshToScene(mesh);
        this.engineService.centerCamera(mesh);
      });
  }
}
