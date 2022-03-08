import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { BoxGeometry, Mesh, MeshBasicMaterial, ObjectLoader } from 'three';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  myfile = [];

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private engineService: EngineService) { }

  ngOnInit(): void {
    this.engineService.createScene(this.canvas);
    this.engineService.animate();
  }

  uploadFile(event: any) {
    console.log({ event });
    const files = event.files;
    let f = files[0];
    console.log({ f });

    const reader = new FileReader()
    reader.onload = (e: any) => {
      const contents = e.target.result;
      const geometry = this.engineService.parseSTL(contents);
      const mesh = this.engineService.createFileMesh(geometry);
      this.engineService.addToScene(mesh);
      this.engineService.centerCamera(mesh);
    };
    reader.readAsText(f);
  }
}
