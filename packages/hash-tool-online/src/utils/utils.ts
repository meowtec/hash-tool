import { MessageData, MessageType, MessageTypeMap } from '../types/worker';

export const generateId = (() => {
  let incId = 0;

  return () => incId++;
})();

export const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const createMessage = <T extends MessageType>(
  type: T,
  data: MessageTypeMap[T],
): MessageData<T> => ({
  isTaskMessage: true,
  type,
  data,
});

const padZeroTwo = (text: string) => (text.length < 2 ? '0' + text : text);

export const formatHash = (buffer: Uint8Array | null) => {
  return buffer?.reduce((prev, curr) => prev + padZeroTwo(curr.toString(16)), '');
};
