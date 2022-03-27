import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Nullable } from 'src/app/models/utils.model';
import { ApiService } from 'src/app/services/api.service';
import { EngineService } from 'src/app/services/engine.service';
import { SceneControlService } from 'src/app/services/scene-control.service';
import { BufferGeometry, Mesh, } from 'three';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  private engineService: EngineService;
  private sceneController: SceneControlService;

  private sceneObjects: { geometry: BufferGeometry, mesh: Mesh }[] = [];
  public justifyOptions: any[] = [];
  public controlMode = 'camera';

  showModelUpload: boolean = false;
  postContent: string = '';
  upload: {
    mesh: Nullable<Mesh>,
    geometry: Nullable<BufferGeometry>,
    snapshot: Nullable<string>,
    snapshotImage: Nullable<File>,
    stl: Nullable<File>
  } = {
      mesh: null,
      geometry: null,
      snapshot: null,
      snapshotImage: null,
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
    this.sceneController = this.engineService.sceneController;

    this.justifyOptions = [
      {icon: 'camera', mode: 'camera'},
      {icon: 'arrows-up-down-left-right', mode: 'translate'},
      {icon: 'rotate', mode: 'rotate'},
      {icon: 'maximize', mode: 'scale'}
    ];
  }

  ngOnInit(): void {
    this.engineService.createScene(this.canvas);
    this.sceneController.setupControls();
    this.engineService.animate();
  }

  takeSnapshot() {
    const image = this.engineService.takeSnapshot();
    this.upload.snapshot = image;
    this.stringToFile(image, 'snapshot.png');
  }

  async stringToFile(str: string, filename: string) {
    await fetch(str)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], filename, { type: 'image/png' });
        this.upload.snapshotImage = file;
      });
  }

  uploadPost() {
    const { snapshotImage, stl } = this.upload;
    const content = this.postContent;

    this.api.post(content, snapshotImage as File, stl as File)
      .subscribe(
        ({ data }: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post uploaded successfully!'
          });
          this.ref.close();
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        }
      );
  }

  addModel() {
    this.showModelUpload = true;
  }

  centerCanvas() {
    if (this.upload.mesh) {
      this.sceneController.centerCamera(this.upload.mesh);
    }
  }

  controlLabel() {
    return 'T';
  }

  renderSTL(event: any) {
    console.log({ event })
    const reader = new FileReader()

    reader.onload = (e: any) => {
      const contents = e.target.result;

      try {
        const geometry = this.engineService.parseSTL(contents);
        const mesh = this.engineService.createFileMesh(geometry);
        this.engineService.addMeshToScene(mesh);
        this.sceneController.centerCamera(mesh);

        const controls = this.sceneController.createTransormControls(mesh);
        this.engineService.addToScene(controls);

        this.sceneObjects.push({ geometry, mesh });

        this.upload = {
          stl: event.target.files[0],
          mesh,
          geometry,
          snapshot: null,
          snapshotImage: null
        };
      } catch (error) {
        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Failed to upload STL',
          detail: 'File might be corrupted or incompatible, please try again'
        });
      }
    };
    reader.readAsText(event.target.files[0]);
  }
}
