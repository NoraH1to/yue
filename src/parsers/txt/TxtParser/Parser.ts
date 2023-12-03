import { Promiser } from '@/helper';
import { Optional } from 'utility-types';
import { INode } from './Node';
import Viewer from './Viewer';
import {
  MSG_POST_MAIN,
  MSG_POST_WORKER,
  createPostMsg,
  handleError,
  handleMessage,
} from './utils/postMsg';

export type ITarget = string | Blob | PromiseLike<string | Blob>;
export type IInitConfig = {
  workerUrl: string;
};

export default class Parser {
  private config: IInitConfig = { workerUrl: 'plain-text-viewer.worker.js' };
  private worker?: Worker;
  private viewer = new Viewer(this);
  nodeList?: INode[];

  constructor(config?: Optional<IInitConfig, 'workerUrl'>) {
    Object.assign(this.config, config);
  }

  async load(target: ITarget) {
    target = typeof target === 'string' || target instanceof Blob ? target : await target;

    const worker = (this.worker = new Worker(this.config.workerUrl, {
      type: 'module',
    }));
    worker.postMessage(createPostMsg(MSG_POST_MAIN.RAW_CONTENT, target));

    const promiser = new Promiser<INode[]>();

    handleMessage(worker, ({ data }) => {
      if (data.type === MSG_POST_WORKER.NODE_DATA) {
        this.nodeList = data.data as unknown as INode[];
        promiser.resolve(this.nodeList);
      }
    });

    handleError(worker, () => promiser.reject(new Error('Generate nodes fail.')));
    return promiser.promise;
  }

  render = this.viewer.render.bind(this.viewer);
  display = this.viewer.display.bind(this.viewer);
  next = this.viewer.next.bind(this.viewer);
  prev = this.viewer.prev.bind(this.viewer);
  jumpTo = this.viewer.jumpTo.bind(this.viewer);

  getLocation() {
    return this.viewer.location;
  }

  destroy() {
    this.worker?.terminate();
    this.viewer.destroy();
  }
}
