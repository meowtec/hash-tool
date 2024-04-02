import { ID } from '../types/base';
import { generateId, randomPick } from './utils';

const IDLE_LIFETIME = 5000;

interface RunnerUncreated {
  id: ID;
  runner: null;
  idle: false;
  lastUsedDate: null;
}

interface RunnerCreated<R> {
  id: ID;
  runner: R;
  idle: boolean;
  lastUsedDate: number;
}

type Runner<R> = RunnerUncreated | RunnerCreated<R>;

type UseRunner<R> = (runner: R, callback: () => void) => boolean;

const emptyUseRunner: UseRunner<any> = () => false;

interface ClusterOptions<R> {
  limit: number;
  createRunner: () => Promise<R>;
  freeRunner: (runner: R) => void;
  use?: UseRunner<R>;
}

export class Cluster<T, R> {
  private runners: Runner<R>[];

  private options: ClusterOptions<R>;

  constructor(options: ClusterOptions<R>) {
    this.runners = [];
    this.options = { ...options };
  }

  private registerRunner() {
    const runner: NoInfer<Runner<R>> = {
      id: generateId(),
      runner: null,
      lastUsedDate: null,
      idle: false,
    };

    this.runners.push(runner);

    this.options.createRunner().then((r) => {
      const runnerCreated: RunnerCreated<R> = {
        id: runner.id,
        runner: r,
        idle: true,
        lastUsedDate: Date.now(),
      };
      Object.assign(runner, runnerCreated);

      this.idleCheck();
    });
  }

  private pickRunner(): RunnerCreated<R> | null {
    const idleRunner = this.runners.filter((runner): runner is RunnerCreated<R> => runner.idle);

    if (idleRunner.length) {
      return randomPick(idleRunner);
    } else if (this.runners.length < this.options.limit) {
      this.registerRunner();
    }

    return null;
  }

  private checkEmptiesAndFree() {
    this.runners = this.runners.filter((runner) => {
      if (runner.idle && runner.lastUsedDate && runner.lastUsedDate < Date.now() - IDLE_LIFETIME) {
        this.options.freeRunner(runner.runner);
        return false;
      }

      return true;
    });
  }

  public setUse(use: UseRunner<R>) {
    this.options.use = use;
  }

  public idleCheck() {
    const runner = this.pickRunner();
    if (!runner) return;

    const use = this.options.use ?? emptyUseRunner;

    const hasWork = use(runner.runner, () => {
      runner.idle = true;
      runner.lastUsedDate = Date.now();

      this.idleCheck();
    });

    if (hasWork) {
      runner.idle = false;
      this.idleCheck();
    } else {
      setTimeout(() => {
        this.checkEmptiesAndFree();
      }, IDLE_LIFETIME);
    }
  }
}
