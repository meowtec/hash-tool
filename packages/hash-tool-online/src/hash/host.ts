import {
  HashTask,
  HashTaskError,
  HashTaskFinish,
  HashTaskProgress,
  MessageDataUnion,
} from '../types/worker';
import { createMessage, generateId } from '../utils/utils';

export function runHashTask(
  task: Omit<HashTask, 'id'>,
  worker: Worker,
  options: {
    onProgress: (progress: HashTaskProgress) => void;
    onFinish: (result: HashTaskFinish | HashTaskError) => void;
  },
) {
  const id = generateId();

  const onmessage = (e: MessageEvent<MessageDataUnion | undefined>) => {
    if (e.data?.isTaskMessage && e.data.data.id === id) {
      if (e.data.type === 'TASK_RESULT') {
        worker.removeEventListener('message', onmessage);
        options.onFinish(e.data.data);
      }

      if (e.data.type === 'TASK_PROGRESS') {
        options.onProgress(e.data.data);
      }
    }
  };

  worker.addEventListener('message', onmessage);

  worker.postMessage(
    createMessage('TASK_ADD', {
      ...task,
      id,
    }),
  );

  return () => {
    worker.postMessage(
      createMessage('TASK_CANCEL', {
        id,
      }),
    );
  };
}
