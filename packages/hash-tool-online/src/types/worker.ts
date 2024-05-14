import { HashType, ID } from './base';

export interface HashTask {
  id: ID;
  data: Blob | Uint8Array;
  type: HashType;
}

export interface HashTaskCancel {
  id: ID;
}

export interface HashTaskProgress {
  id: ID;
  processedBytes: number;
  totalBytes: number;
}

export interface HashTaskFinish {
  id: ID;
  success: true;
  totalBytes: number;
  hash: Uint8Array;
  timing: number;
}

export interface HashTaskError {
  id: ID;
  success: false;
  error: string;
}

export type MessageTypeMap = {
  TASK_ADD: HashTask;
  TASK_PROGRESS: HashTaskProgress;
  TASK_RESULT: HashTaskFinish | HashTaskError;
  TASK_CANCEL: HashTaskCancel;
};

export type MessageType = keyof MessageTypeMap;

export type MessageData<K extends MessageType> = {
  isTaskMessage: true;
  type: K;
  data: MessageTypeMap[K];
};

export type MessageDataUnion = {
  [K in MessageType]: MessageData<K>;
}[MessageType];
