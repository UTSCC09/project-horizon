import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Nullable } from 'src/app/models/utils.model';
import { EngineService } from 'src/app/services/engine.service';
import { BufferGeometry, Mesh, } from 'three';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  upload: {
    mesh: Nullable<Mesh>,
    geometry: Nullable<BufferGeometry>,
    snapshot: Nullable<string>,
  } = {
    mesh: null,
    geometry: null,
    snapshot: null,
  };

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private engineService: EngineService) { }

  ngOnInit(): void {
    this.engineService.createScene(this.canvas);
    this.engineService.animate();
  }

  takeSnapshot() {
    const image = this.engineService.takeSnapshot();
    this.upload.snapshot = image;

    const downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = "snapshot.png";
    downloadLink.click();
  }

  uploadFile() {

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
        mesh,
        geometry,
        snapshot: null,
      };
    };

    reader.readAsText(event.files[0]);
  }
}
