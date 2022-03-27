import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ControlModes, Upload } from 'src/app/models/controls.model';
import { ApiService } from 'src/app/services/api.service';
import { EngineService } from 'src/app/services/engine.service';
import { SceneControlService } from 'src/app/services/scene-control.service';
import { BufferGeometry, GridHelper, Mesh, MeshStandardMaterial, } from 'three';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  private engineService: EngineService;
  private sceneController: SceneControlService;

  private sceneObjects: { geometry: BufferGeometry, mesh: Mesh }[] = [];
  public controlOptions: any[] = [];
  loading = false;

  grid: GridHelper;

  showModelUpload: boolean = false;
  postContent: string = '';
  upload: Upload = {
    name: '',
    mesh: null,
    geometry: null,
    snapshot: null,
    snapshotImage: null,
    stl: null,
    color: 0xffffff,
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
    this.grid = new GridHelper(1000, 30);

    this.controlOptions = [
      { icon: 'camera', mode: ControlModes.Camera, tooltip: '(C) - Camera Controls \n Right mouse to pan and Left mouse to rotate'},
      {icon: 'arrows-up-down-left-right', mode: ControlModes.Translate, tooltip: '(T) - Show object translation controls'},
      {icon: 'rotate', mode: ControlModes.Rotate, tooltip: '(R) - Show object rotation controls'},
      {icon: 'maximize', mode: ControlModes.Scale, tooltip: '(S) - Show object scale controls'},
    ];
  }

  ngOnInit(): void {
    this.engineService.createScene(this.canvas);
    this.sceneController.setupControls();
    this.engineService.animate();

    this.engineService.addToScene(this.grid);
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

  centerCanvas() {
    if (this.upload.mesh) {
      this.sceneController.centerCamera();
    }
  }

  updateColor(upload: Upload) {
    if (!upload.mesh) return;
    if (typeof (upload.color as any) === 'string') {
      (upload.mesh.material as MeshStandardMaterial).color.setHex( Number((upload.color as any).replace('#', '0x')));
    } else {
      (upload.mesh.material as MeshStandardMaterial).color.setHex(upload.color);
    }

  }

  centerUpload(upload: Upload) {
    console.log("center upload", { upload })
    if (!upload.mesh) return;
    this.sceneController.centerCameraToObject(upload.mesh);
  }

  removeUpload(upload: Upload) {
    if (!upload.mesh || !upload.controls) return;
    this.sceneController.removeMeshFromScene(upload.mesh, upload.controls);
    this.sceneObjects = this.sceneObjects.filter(c => c.mesh !== upload.mesh);
    this.uploads = this.uploads.filter(c => c !== upload);
  }

  renderSTL(event: any) {
    const reader = new FileReader()
    const files = event.target.files;
    this.loading = true

    reader.onload = (e: any) => {
      const contents = e.target.result;

      try {
        // console.log({ files, contents })
        if (/�/.test(contents)) {
          throw new Error('File is not a valid STL file');
        }

        const geometry = this.engineService.parseSTL(contents);
        const mesh = this.engineService.createFileMesh(geometry);
        mesh.rotateX(-Math.PI/2);
        this.engineService.addMeshToScene(mesh);

        const controls = this.sceneController.createTransormControls(mesh);
        this.sceneController.updateSceneControl(ControlModes.Camera);
        this.sceneController.centerCameraToObject(mesh);

        this.upload = {
          name: files[0].name,
          size: files[0].size,
          last_modified: files[0].lastModified,
          stl: files[0],
          mesh,
          geometry,
          controls,
          snapshot: this.engineService.createMeshSnapshot(mesh, this.sceneObjects.map(c => c.mesh)),
          snapshotImage: null,
          color: 0xffffff,
        };

        this.uploads.push(this.upload);
        this.sceneObjects.push({ geometry, mesh });
      } catch (error) {
        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Failed to upload STL',
          detail: 'File might be corrupted or incompatible, please try again'
        });
      } finally {
        event.target.value = '';
        this.loading = false;
      }
    };
    reader.readAsText(files[0]);
  }
}
