import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Nullable } from 'src/app/models/utils.model';
import { ApiService } from 'src/app/services/api.service';
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
    stl: Nullable<File>
  } = {
    mesh: null,
    geometry: null,
    snapshot: null,
    stl: null
  };

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private api: ApiService,
    private messageService: MessageService,
  ) {
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

  stringToFile(str: string, filename: string) {
    const blob = new Blob([str], { type: 'text/plain' });
    return new File([blob], filename, { type: 'text/plain' });
  }

  uploadPost() {
    const { snapshot, stl } = this.upload;
    const content = this.postContent;

    this.api.post(new FormGroup({content: new FormControl(content)}))
      .subscribe(
        ({data}: any) => {
          console.log(data);
          [this.stringToFile(snapshot as string, 'snapshot.png'), stl].forEach(file => {
            if (file)
            this.api.upload(file, data.createPost.id).subscribe(res => {
              this.messageService.add({
                severity: 'success',
                summary: 'Uploaded',
                detail: 'File uploaded successfully'
              });
            });
          });
        },
        error => {
          console.log(error);
        }
      );


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
        stl: event.files[0],
        mesh,
        geometry,
        snapshot: null,
      };
    };
    reader.readAsText(event.files[0]);
  }
}
