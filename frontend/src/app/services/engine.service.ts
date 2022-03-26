import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Mesh, Object3D } from 'three';
import { BehaviorSubject } from 'rxjs';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

/**
 * @class EngineService
 * @description
 * This class is responsible for creating the scene and rendering it.
 * It also handles the camera and controls and scene events.
 *
 * @Credits
 * This class is based on the official three.js angular template:
 * https://github.com/JohnnyDevNull/ng-three-template/blob/4a58a53d48d050f8d4f720c4a6e37d770f11812c/src/app/engine/engine.service.ts
 *
 */
@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private canvas!: HTMLCanvasElement | null;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private light!: THREE.AmbientLight;
  private controls!: OrbitControls;

  private frameId: number | null = null;
  private stlLoader: STLLoader = new STLLoader();
  private ngZone: NgZone;

  private meshList: Mesh[] = [];
  private transformControls: TransformControls[] = [];

  private _mouseClick: BehaviorSubject<MouseEvent> = new BehaviorSubject(new MouseEvent('click'));

  constructor() {
    this.ngZone = new NgZone({ enableLongStackTrace: false });
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      canvas: this.canvas,
      // alpha: true,    // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000
    );
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0x404040, 1);
    this.light.position.set(10, 10, 10);
    this.scene.add(this.light);

    const spotLight = new THREE.SpotLight(
      0xffffff,
      1,
      200,
      Math.PI / 4,
      0.1,
      2
    );
    spotLight.position.set(15, 40, 35);

    spotLight.castShadow = true;
    this.scene.add(spotLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.initListeners();
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', this.render.bind(this));
      }
    });
  }

  /**
   * Fit camera to centered object
   * Code Altered from: https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
   * @param object The object to center
   * @param offset The distance multiplier to center the object
   */
  fitCameraToCenteredObject(object: Mesh, offset: number = 1) {
    const boundingBox = new THREE.Box3().setFromObject(object);

    var size = new THREE.Vector3();
    boundingBox.getSize(size);

    const fov = this.camera.fov * (Math.PI / 180);
    const fovh = 2 * Math.atan(Math.tan(fov / 2) * this.camera.aspect);
    let dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
    let dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
    let cameraZ = Math.max(dx, dy) * offset;

    this.camera.position.set(0, -cameraZ, cameraZ);

    // set the far plane of the camera so that it easily encompasses the whole object
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();

    // set camera to rotate around the center
    this.controls.target = new THREE.Vector3(0, 0, 0);

    // prevent camera from zooming out far enough to create far plane cutoff
    this.controls.maxDistance = cameraToFarEdge * 2;
  };

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

  /*
    Functions below this point are entirely original
  */

  public disableControls(overide = false): void {
    this.controls.enabled = false;
    if (!overide) {
      document.addEventListener('mouseup', () => {
        this.controls.enabled = true;
      }, {once : true});
    }
  }

  public createTransormControls(object: Object3D): TransformControls {
    const controls = new TransformControls(this.camera, this.renderer.domElement);
    controls.setMode('translate');
    this.transformControls.push(controls);

    controls.enabled = false;

    return controls.attach(object);
  }

  public getCollidingObjects(e: MouseEvent, objects: Object3D[]) {
    if (!this.canvas) return [];

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mouse.x = (e.clientX / this.canvas.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / this.canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);

    return raycaster.intersectObjects(objects);
  }

  public mouseClick(): BehaviorSubject<MouseEvent> {
    return this._mouseClick;
  }

  public initListeners() {
    this.canvas?.addEventListener('mousedown', (event: MouseEvent) => {
      this._mouseClick.next(event);
    });

    document.addEventListener('keydown', (event) => {
      let mode: 'translate' | 'rotate' | 'scale' = 'translate';
      let controller = this.controls.enabled;
      console.log(event.key);
      switch(event.key) {
        // R
        case 'r':
          mode = 'rotate';
          controller = false;
          break;
        // T
        case 't':
          mode = 'translate';
          controller = false;
          break;
        // S
        case 's':
          mode = 'scale';
          controller = false;
          break;
        // C
        case 'c':
          controller = true;
      }

      this.controls.enabled = controller;
      this.transformControls.forEach(c => {
        c.setMode(mode);
        c.enabled = !controller;
      });
    });
  }

  public createFileMesh(geometry: any) {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    return new THREE.Mesh(geometry, material);
  }

  public takeSnapshot() {
    this.render();
    return this.renderer.domElement.toDataURL('image/png');
  }

  public addMeshToScene(mesh: THREE.Mesh): void {
    this.addToScene(mesh);
    this.meshList.push(mesh);
  }

  public addToScene(object: THREE.Object3D) {
    this.scene.add(object);
  }

  public centerCamera(mesh: THREE.Mesh): void {
    this.fitCameraToCenteredObject(mesh, 1);
    this.controls.update();
  }

  parseSTL(contents: string | ArrayBuffer) {
    return this.stlLoader.parse(contents);
  }
}
