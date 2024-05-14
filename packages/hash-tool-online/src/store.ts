import { produce } from 'immer';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FileOrText, HashType, ID } from './types/base';
import { hashWorkerCluster } from './hash/worker-cluster';
import { runHashTask } from './hash/host';
import { generateId } from './utils/utils';

export interface HashTaskState {
  stage: 'STARTED' | 'PROCESSING' | 'FINISH' | 'ERROR';
  startDate: number;
  endDate?: number;
  processedBytes?: number;
  totalBytes?: number;
  hash?: Uint8Array;
  timing?: number;
  error?: string;
  cancel?: () => void;
}

export interface HashesTaskItem {
  id: number;
  content: FileOrText;
  hashes: {
    [type in HashType]?: HashTaskState;
  };
}

export interface HashToolOptions {
  hashTypes: HashType[];
}

interface AppState {
  options: HashToolOptions;
  hashesTasks: HashesTaskItem[];
}

interface AppAction {
  addTasks: (files: FileOrText[]) => void;

  pickPendingTask: () => { task: HashesTaskItem; hashType: HashType } | null;

  updateTask: <K extends keyof HashTaskState>(
    id: ID,
    type: HashType,
    data: Pick<HashTaskState, K>,
  ) => void;

  removeTask: (id: ID) => void;

  updateOptions: (options: HashToolOptions) => void;
}

const initialState: AppState = {
  options: {
    hashTypes: ['md5', 'sha256'],
  },
  hashesTasks: [],
};

export const useAppStore = create<AppState & AppAction>()(
  persist(
    (set, get) => ({
      ...initialState,

      addTasks(contents) {
        set((state) => ({
          ...state,
          hashesTasks: [
            ...state.hashesTasks,
            ...contents.map((content) => ({
              id: generateId(),
              content,
              hashes: {},
            })),
          ],
        }));

        hashWorkerCluster.idleCheck();
      },

      pickPendingTask() {
        const state = get();

        const { hashTypes } = state.options;

        for (const hashesTask of state.hashesTasks) {
          for (const hashType of hashTypes) {
            if (hashesTask.hashes[hashType] == null) {
              return { task: hashesTask, hashType };
            }
          }
        }

        return null;
      },

      updateTask(id, type, data) {
        set(
          produce<AppState>((draft) => {
            const hashesTask = draft.hashesTasks.find((task) => task.id === id);

            if (hashesTask) {
              hashesTask.hashes[type] = {
                ...hashesTask.hashes[type],
                ...(data as HashTaskState),
              };
            }
          }),
        );
      },

      removeTask(id) {
        set((state) => ({
          ...state,
          hashesTasks: state.hashesTasks.filter((item) => {
            const shouldDelect = item.id === id;

            if (shouldDelect) {
              Object.values(item.hashes).forEach((item) => {
                item.cancel?.();
              });
            }

            return !shouldDelect;
          }),
        }));
      },

      updateOptions(options) {
        set((draft) => ({
          ...draft,
          options,
        }));

        hashWorkerCluster.idleCheck();
      },
    }),
    {
      name: 'hash-tool',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ options: state.options }),
    },
  ),
);

hashWorkerCluster.setUse((worker, callback) => {
  const { pickPendingTask, updateTask } = useAppStore.getState();
  const pendingTask = pickPendingTask();

  if (!pendingTask) {
    return false;
  }

  const { task, hashType } = pendingTask;
  const { id, content } = task;

  updateTask(id, hashType, {
    stage: 'STARTED',
    startDate: Date.now(),
  });

  const cancel = runHashTask(
    {
      type: pendingTask.hashType,
      data: typeof content === 'string' ? new TextEncoder().encode(content) : content,
    },
    worker,
    {
      onProgress(progress) {
        updateTask(id, hashType, {
          stage: 'PROCESSING',
          processedBytes: progress.processedBytes,
          totalBytes: progress.totalBytes,
        });
      },
      onFinish(result) {
        // free worker
        callback();

        if (result.success) {
          updateTask(id, hashType, {
            stage: 'FINISH',
            totalBytes: result.totalBytes,
            hash: result.hash,
            timing: result.timing,
            cancel: undefined,
          });
        } else {
          updateTask(id, hashType, {
            stage: 'ERROR',
            error: result.error,
            cancel: undefined,
          });
        }
      },
    },
  );

  updateTask(id, hashType, {
    stage: 'STARTED',
    cancel,
  });

  return true;
});

Object.assign(window, { useAppStore, hashWorkerCluster });
