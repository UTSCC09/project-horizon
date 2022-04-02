import { Injectable, OnDestroy } from '@angular/core';
import { Box3, Mesh, Object3D, PerspectiveCamera, Raycaster, Vector2, Vector3 } from 'three';
import { EngineService } from './engine.service';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { ControlModes, TransformModes } from '../models/controls.model';

@Injectable({
  providedIn: 'root'
})
export class SceneControlService implements OnDestroy {

  private _camera!: PerspectiveCamera;
  private _cameraControls!: OrbitControls;
  private _ready: boolean = false;

  private ignoreKeyboard: boolean = false;

  get ready(): boolean {
    return this._ready;
  }

  get currentMode(): ControlModes {
    return this.activeMode;
  }

  private activeMode: ControlModes = ControlModes.Camera;
  private modeToControl = {
    [ControlModes.Camera]: null,
    [ControlModes.Translate]: 'translate',
    [ControlModes.Rotate]: 'rotate',
    [ControlModes.Scale]: 'scale',
  }

  private _objectControls: TransformControls[];

  get camera(): PerspectiveCamera {
    return this._camera;
  }

  constructor(private engineService: EngineService) {
    this._objectControls = [];
  }

  /**
   * NOTE: Should only be called after canvas is setup
   */
  public setupControls() {
    this._camera = new PerspectiveCamera(
      75, this.engineService.canvasRatio(), 0.1, 10000
    );
    this._camera.position.set(0, 70, 80);
    this._cameraControls = new OrbitControls(this._camera, this.engineService.renderedDomElement());

    this.engineService.addToScene(this._camera);
    this._ready = true;
    this.initModeListener();
  }

  public updateSceneControl(mode: ControlModes): void {
    if (!this.ready) return;
    this.activeMode = mode;

    if (this.modeToControl[mode]) {
      this._cameraControls.enabled = false;
      this._objectControls.forEach(c => {
        c.setMode(this.modeToControl[mode] as TransformModes);
        c.enabled = true;
        c.visible = true;
      });
    } else {
      this._cameraControls.enabled = true;
      this._objectControls.forEach(c => {
        c.enabled = false;
        c.visible = false;
      });
    }
  }

  public removeControls() {
    this._objectControls.forEach(c => {
      this.engineService.removeFromScene(c);
      c.detach().dispose();
    });
    this._cameraControls.dispose();
    this._objectControls = [];
  }

  public createTransormControls(object: Object3D): TransformControls {
    const controls = new TransformControls(this._camera, this.engineService.renderedDomElement());
    controls.setMode('translate');
    this._objectControls.push(controls);
    controls.attach(object)

    this.engineService.addToScene(controls);

    if (this.activeMode == ControlModes.Camera) {
      controls.enabled = false;
      controls.visible = false;
    }

    return controls;
  }

  initModeListener() {
    document.addEventListener('keydown', (event) => {
      if (this.ignoreKeyboard) return;
      switch(event.key) {
        case 'r':
          this.updateSceneControl(ControlModes.Rotate);
          break;
        case 't':
          this.updateSceneControl(ControlModes.Translate);
          break;
        case 's':
          this.updateSceneControl(ControlModes.Scale);
          break;
        case 'c':
          this.updateSceneControl(ControlModes.Camera);
          break;
      }
    });
  }

  hideControls() {
    this._objectControls.forEach(c => c.visible = false);
  }

  showControls() {
    if (this.activeMode != ControlModes.Camera)
      this._objectControls.forEach(c => c.visible = true);
  }

  removeMeshFromScene(mesh: Mesh, controls: TransformControls): void {
    this._objectControls.splice(this._objectControls.indexOf(controls), 1);
    controls.detach().dispose();
    this.engineService.removeFromScene(mesh);
  }

  /**
   * Fit camera to centered object
   * Code Altered from: https://wejn.org/2020/12/cracking-the-threejs-object-fitting-nut/
   * @param object The object to center
   * @param offset The distance multiplier to center the object
   */
  fitCameraToCenteredObject(object: Object3D, offset: number = 1) {
    const boundingBox = new Box3().setFromObject(object);

    var size = new Vector3();
    boundingBox.getSize(size);

    const fov = this._camera.fov * (Math.PI / 180);
    const fovh = 2 * Math.atan(Math.tan(fov / 2) * this._camera.aspect);
    let dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
    let dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
    let cameraZ = Math.max(dx, dy) * offset;

    this._camera.position.set(0, cameraZ, cameraZ);

    // set the far plane of the camera so that it easily encompasses the whole object
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    this._camera.far = cameraToFarEdge * 35;
    this._camera.updateProjectionMatrix();

    // set camera to rotate around the center
    this._cameraControls.target = new Vector3(0, 0, 0);
  };

  public getCollidingObjects(e: MouseEvent, objects: Object3D[]) {
    if (!this.engineService.canvas) return [];

    const mouse = new Vector2();
    const raycaster = new Raycaster();

    mouse.x = (e.clientX / this.engineService.canvas.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / this.engineService.canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);

    return raycaster.intersectObjects(objects);
  }

  centerCamera() {
    this._cameraControls.target = new Vector3(0, 0, 0);
    this._cameraControls.update();
  }

  public centerCameraToObject(object: Object3D): void {
    this.fitCameraToCenteredObject(object);
    this._cameraControls.target.copy(object.position);
    this._cameraControls.update();
  }

  ngOnDestroy() {
    this.removeControls();
    this._ready = false;
  }

  updateKeyListener(val: boolean) {
    this.ignoreKeyboard = val;
    if (val) this.updateSceneControl(ControlModes.Camera);
  }
}
