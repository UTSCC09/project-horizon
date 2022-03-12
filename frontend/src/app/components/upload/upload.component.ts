import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Nullable } from 'src/app/models/utils.model';
import { EngineService } from 'src/app/services/engine.service';
import { BufferGeometry, Mesh, } from 'three';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  private engineService: EngineService;

  showModelUpload: boolean = false;
  postContent: string = '';
  upload: {
    mesh: Nullable<Mesh>,
    geometry: Nullable<BufferGeometry>,
    snapshot: Nullable<string>,
    stl: Nullable<string>
  } = {
    mesh: null,
    geometry: null,
    snapshot: null,
    stl: null
  };

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {
    this.engineService = new EngineService();
  }

  ngOnInit(): void {
    this.engineService.createScene(this.canvas);
    this.engineService.animate();
  }

  takeSnapshot() {
    const image = this.engineService.takeSnapshot();
    this.upload.snapshot = image;
  }

  uploadPost() {
    const { snapshot, stl } = this.upload;
    const content = this.postContent;

    // TODO: upload to server
    console.log(snapshot, stl, content);
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Post uploaded successfully'});
    this.ref.close();
  }

  addModel() {
    this.showModelUpload = true;
  }

  centerCanvas() {
    if(this.upload.mesh) {
      this.engineService.centerCamera(this.upload.mesh);
    }
  }

  renderSTL(event: any) {
    const reader = new FileReader()

    reader.onload = (e: any) => {
      const contents = e.target.result;
      const geometry = this.engineService.parseSTL(contents);
      const mesh = this.engineService.createFileMesh(geometry);
      this.engineService.addToScene(mesh);
      this.engineService.centerCamera(mesh);

      this.upload = {
        stl: contents,
        mesh,
        geometry,
        snapshot: null,
      };
    };

    reader.readAsText(event.files[0]);
  }
}
