import * as THREE from 'three';
import { ElementRef, Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private canvas!: HTMLCanvasElement | null;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private light!: THREE.AmbientLight;

  private frameId: number | null = null;

  private loader: THREE.FileLoader = new THREE.FileLoader();

  get fileLoader() {
    return this.loader;
  }

  constructor(private ngZone: NgZone) { }

  public createFileMesh(geometry: any) {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xb2ffc8,
      metalness: 0.25,
      roughness: 0.1,
      opacity: 1.0,
      transparent: true,
      transmission: 0.99,
      clearcoat: 1.0,
      clearcoatRoughness: 0.25
    })
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public addToScene(mesh: THREE.Mesh): void {
    this.scene.add(mesh);
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.canvas = null;
    }
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
