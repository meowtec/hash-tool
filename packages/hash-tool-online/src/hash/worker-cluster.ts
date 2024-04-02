import { Cluster } from '../utils/cluster';
import Worker from './worker?worker';

export const hashWorkerCluster = new Cluster({
  limit: Math.max(navigator.hardwareConcurrency - 1, 1),
  createRunner: () => {
    return new Promise<Worker>((resolve) => {
      const worker = new Worker();

      const initCallback = () => {
        worker.removeEventListener('message', initCallback);
        resolve(worker);
      };

      worker.addEventListener('message', initCallback);
    });
  },
  freeRunner: (worker) => {
    worker.terminate();
  },
});
