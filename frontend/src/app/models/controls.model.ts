import { BufferGeometry, Mesh } from "three"
import { Nullable } from "./utils.model"

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
  }