import { HashDigest } from '@meowtec/hash-tool';
import { HashTask, MessageDataUnion, MessageType, MessageTypeMap } from '../types/worker';
import { createMessage } from '../utils/utils';
import { BlobReader, Uint8ArrayReader } from '../utils/readers';
import { ID } from '../types/base';

function postMessage<T extends MessageType>(type: T, data: MessageTypeMap[T]) {
  globalThis.postMessage(createMessage(type, data));
}

// 8M
const CHUNK_SIZE = 1024 * 1024 * 8;

const PENDING_SET = new Set<ID>();

function removeTask(id: ID) {
  PENDING_SET.delete(id);
}

async function handleTask({ type, data, id }: HashTask) {
  const digest = new HashDigest(type);
  const reader = data instanceof Blob ? new BlobReader(data) : new Uint8ArrayReader(data);
  const { byteLength } = reader;
  let index = 0;
  PENDING_SET.add(id);

  while (index < byteLength) {
    if (!PENDING_SET.has(id)) {
      postMessage('TASK_RESULT', {
        id,
        success: false,
        error: 'Task cancel',
      });

      return;
    }

    const chunk = await reader.read(index, CHUNK_SIZE);
    digest.update(chunk);
    index += chunk.byteLength;

    postMessage('TASK_PROGRESS', {
      id,
      processedBytes: index,
      totalBytes: byteLength,
    });
  }

  const hash = digest.finalize();

  removeTask(id);

  postMessage('TASK_RESULT', {
    id,
    hash,
    success: true,
    totalBytes: byteLength,
  });
}

globalThis.onmessage = (message: MessageEvent<MessageDataUnion | undefined>) => {
  if (!message.data?.isTaskMessage) return;

  const msg = message.data;

  if (msg.type === 'TASK_ADD') {
    handleTask(msg.data).catch((err: any) => {
      postMessage('TASK_RESULT', {
        id: msg.data.id,
        success: false,
        error: String(err),
      });
    });
  }

  if (msg.type === 'TASK_CANCEL') {
    removeTask(msg.data.id);
  }
};

globalThis.postMessage('INIT');
