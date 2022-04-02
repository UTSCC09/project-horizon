import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Mesh, Object3D } from 'three';
import { BehaviorSubject } from 'rxjs';

import { SceneControlService } from './scene-control.service';
import { EngineManagerService } from './engine-manager.service';

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
export class EngineService implements OnDestroy {
  private _canvas!: HTMLCanvasElement | null;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private light!: THREE.HemisphereLight;

  private frameId: number | null = null;
  private stlLoader: STLLoader;
  private ngZone: NgZone;

  private meshList: Mesh[] = [];
  private _sceneController: SceneControlService;

  private _mouseClick: BehaviorSubject<MouseEvent> = new BehaviorSubject(new MouseEvent('click'));
  private _rendering: boolean = false;

  /**
   * Priority of this engine instance
   * Used to determine which engine to destroy when there are multiple instances
   */
  private _priority: number = 0;

  get rendering(): boolean {
    return this._rendering;
  }

  get priority(): number {
    return this._priority;
  }

  get sceneController() {
    return this._sceneController;
  }

  get canvas() {
    return this._canvas;
  }

  constructor(private manager: EngineManagerService) {
    this.ngZone = new NgZone({ enableLongStackTrace: false });
    this._sceneController = new SceneControlService(this);
    this.stlLoader = new STLLoader();
  }

  public setPriority(priority: number) {
    this._priority = priority;
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.manager.activateEngine(this);

    // The first step is to get the reference of the canvas element from our HTML document
    this._canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      canvas: this._canvas,
      alpha: true,    // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // create the scene
    this.scene = new THREE.Scene();

    // soft white light
    this.light = new THREE.HemisphereLight(0x404040, 0x404040, 1);
    this.light.position.set(10, 10, 10);
    this.scene.add(this.light);

    const spotLight = new THREE.DirectionalLight(0xffffff, 1);
    this.scene.add(spotLight);

    this.initListeners();
  }

  public canvasRatio() {
    if (!this._canvas) return -1;

    return this._canvas.clientWidth / this._canvas.clientHeight;
  }

  public renderedDomElement(): HTMLCanvasElement {
    return this.renderer?.domElement;
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this._rendering = true;
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', this.render.bind(this));
      }
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.sceneController.camera);
  }

  public updateRendererColor(color: string): void {
    this.renderer.setClearColor(color);
  }

  public saveAndDestroy(): any {
    this.scene.updateMatrixWorld();
    const data = this.scene.toJSON();
    this.resetState();
    return data;
  }

  loadScene(data: any) {
    const loader = new THREE.ObjectLoader();
    this.scene = loader.parse(data);

    this.render();
  }

  public ngOnDestroy(): void {
    this.resetState();
  }

  public resetState(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }

    if (this.renderer != null) {
      this.renderer.dispose();
      this._canvas = null;
    }

    this._rendering = false;
  }

  /*
    Functions below this point are entirely original
  */

  public mouseClick(): BehaviorSubject<MouseEvent> {
    return this._mouseClick;
  }

  public initListeners() {
    this.canvas?.addEventListener('mousedown', (event: MouseEvent) => {
      this._mouseClick.next(event);
    });
  }

  public createFileMesh(geometry: any) {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    return new THREE.Mesh(geometry, material);
  }

  createMeshSnapshot(mesh: Mesh, sceneObjects: Mesh[]) {
    sceneObjects.forEach(o => o.visible = false);
    mesh.visible = true;

    const image = this.takeSnapshot()
    sceneObjects.forEach(o => o.visible = true);

    return image;
  }

  public takeSnapshot() {
    this.render();
    return this.renderer.domElement.toDataURL('image/png');
  }

  public addMeshToScene(mesh: Mesh): void {
    this.addToScene(mesh);
    this.meshList.push(mesh);
  }

  removeFromScene(object: Object3D) {
    this.scene.remove(object);
  }

  public addToScene(object: Object3D) {
    this.scene.add(object);
  }

  parseSTL(contents: string | ArrayBuffer) {
    return this.stlLoader.parse(contents);
  }
}
