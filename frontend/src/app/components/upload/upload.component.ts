import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ControlModes, Upload } from 'src/app/models/controls.model';
import { Nullable } from 'src/app/models/utils.model';
import { ApiService } from 'src/app/services/api.service';
import { EngineService } from 'src/app/services/engine.service';
import { SceneControlService } from 'src/app/services/scene-control.service';
import { BufferGeometry, Mesh, } from 'three';

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
  loading = false;

  showModelUpload: boolean = false;
  postContent: string = '';
  upload: Upload = {
    mesh: null,
    geometry: null,
    snapshot: null,
    snapshotImage: null,
    stl: null
  };

  uploads: Upload[] = [];

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
      {icon: 'camera', mode: ControlModes.Camera},
      {icon: 'arrows-up-down-left-right', mode: ControlModes.Translate },
      {icon: 'rotate', mode: ControlModes.Rotate },
      {icon: 'maximize', mode: ControlModes.Scale }
    ];
  }

  ngOnInit(): void {
    this.engineService.createScene(this.canvas);
    this.sceneController.setupControls();
    this.engineService.animate();
  }

  get currentMode() {
    return this.sceneController.currentMode;
  }

  updateMode(event: any) {
    this.sceneController.updateSceneControl(event.value);
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
    const reader = new FileReader()
    const files = event.target.files;
    this.loading = true

    reader.onload = (e: any) => {
      const contents = e.target.result;

      try {
        const geometry = this.engineService.parseSTL(contents);
        const mesh = this.engineService.createFileMesh(geometry);
        this.engineService.addMeshToScene(mesh);
        this.sceneController.centerCamera(mesh);

        this.sceneController.createTransormControls(mesh);

        this.upload = {
          stl: files[0],
          mesh,
          geometry,
          snapshot: null,
          snapshotImage: null
        };

        this.uploads.push(this.upload);

        this.sceneController.updateSceneControl(ControlModes.Camera);
        const image = this.engineService.createMeshSnapshot(mesh, this.sceneObjects.map(c => c.mesh));
        this.sceneObjects.push({ geometry, mesh });
        this.upload.snapshot = image;

        event.target.value = '';
        this.loading = false;
      } catch (error) {
        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Failed to upload STL',
          detail: 'File might be corrupted or incompatible, please try again'
        });
      }
    };
    reader.readAsText(files[0]);
  }
}
