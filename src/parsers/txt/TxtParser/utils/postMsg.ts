export enum MSG_POST_MAIN {
  RAW_CONTENT = 'RAW_CONTENT',
}
export enum MSG_POST_WORKER {
  RAW_CONTENT_ERROR = 'RAW_CONTENT_ERROR',
  NODE_DATA = 'NODE_DATA',
}
export enum ERROR_WORKER {
  RAW_CONTENT_EMPTY = 'RAW_CONTENT_EMPTY',
}

export type IMessage<T = unknown> = {
  type: MSG_POST_MAIN | MSG_POST_WORKER;
  data?: T;
};

export const createPostMsg = <T>(type: IMessage['type'], data?: T): IMessage<T> => ({
  type,
  data,
});

export const handleMessage = (
  target: Worker,
  handler: (this: Worker, ev: MessageEvent<IMessage>) => any,
) => {
  target.addEventListener('message', handler);
  return () => target.removeEventListener('message', handler);
};

export const handleError = (target: Worker, handler: (this: Worker, ev: ErrorEvent) => any) => {
  target.addEventListener('error', handler);
  return () => target.removeEventListener('error', handler);
};
