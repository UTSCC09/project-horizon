import { BufferGeometry, Mesh } from "three";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { Nullable } from "./utils.model";

export enum ControlModes {
	Camera,
	Translate,
	Rotate,
	Scale,
}

export type TransformModes = 'translate' | 'rotate' | 'scale'

export type Upload = {
    mesh: Nullable<Mesh>,
    geometry: Nullable<BufferGeometry>,
    snapshot: Nullable<string>,
    snapshotImage: Nullable<File>,
    stl: Nullable<File>
    size?: number,
    name: string,
    last_modified?: number,
    controls?: TransformControls,
  }