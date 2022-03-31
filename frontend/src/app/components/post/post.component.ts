import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserPost } from 'src/app/models/user.model';
import { File } from 'src/app/models/user.model';
import { EngineManagerService } from 'src/app/services/engine-manager.service';
import { EngineService } from 'src/app/services/engine.service';
import { SceneControlService } from 'src/app/services/scene-control.service';
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
  private sceneController: SceneControlService;

  renderEngine: boolean = false;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private em: EngineManagerService) {
    this.engineService = new EngineService(em);
    this.sceneController = this.engineService.sceneController;

    this.em.onEngineReset().subscribe((engine) => {
      if (engine == this.engineService) {
        this.renderEngine = false;
        this.canvas.nativeElement.classList.add('hidden');
      }
    })
  }

  get snapshot() {
    return this.post?.files?.filter(file => this.isImage(file))[0];
  }

  get scene() {
    return this.post?.files?.filter(file => file.mimetype === 'application/json')[0];
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
    this.sceneController.setupControls();
    this.engineService.animate();
    fetch(this.fileUrl(this.scene))
      .then(res => res.blob())
      .then(async blob => {
        const file = new File([blob], this.scene?.filename || '', { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = (e) => {
          const scene = JSON.parse(reader.result as string);
          this.engineService.loadScene(scene);
        };

        reader.readAsText(file);
      });
  }
}
