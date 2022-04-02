import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EngineService } from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class EngineManagerService {
  private engines: EngineService[] = [];
  private _engineReset: Subject<EngineService> = new Subject()

  constructor() { }

  activateEngine(engine: EngineService): EngineService {
    if (environment.maxEngineInstances >= this.engines.length) {
      this.pauseEngine();
    }

    this.engines.push(engine);
    this.engines.sort((a, b) => {
      // engines not rendering are always first
      if (!a.rendering) return -1;
      if (!b.rendering) return 1;

      return a.priority - b.priority;
    });

    return engine;
  }

  onEngineReset() {
    return this._engineReset;
  }

  pauseEngine() {
    const engine = this.engines.pop();

    if (engine) {
      this._engineReset.next(engine);
      engine.resetState();
    }
  }
}
