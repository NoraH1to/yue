import { Promiser } from '@/helper';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

export enum JOB_STATE {
  PAUSE = 'pause',
  WAITING = 'waiting',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export type IProcessJobActions<T> = {
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  setProgress: (progress: IJob<unknown>['progress']) => void;
  setInfo: (info: IJob<T>['info']) => void;
  getJob: () => IJob<T> | undefined;
};

export type IJob<T> = {
  id: string | symbol;
  info: T;
  state: JOB_STATE;
  progress?: number;
  run: (actions: IProcessJobActions<T>) => Promise<unknown>;
  promiser: Promiser<unknown>;
  actions: IProcessJobActions<T>;
};

export type IProcessStore<T> = {
  process: Map<IJob<T>['id'], IJob<T>>;
  /**
   * Append new job to queue, will overwrite if has same `id`
   * @param config Job config
   * @returns
   */
  append: <P = unknown>(config: {
    id?: IJob<T>['id'];
    info: T;
    run: (actions: IProcessJobActions<T>) => Promise<P>;
  }) => IProcessJobActions<T> & { jobPromise: Promise<P> };
  /**
   * Start check and exec job in event-loop
   * @param interval `setInterval` timeout
   * @returns
   */
  start: (interval?: number) => void;
  /**
   * Pause all waiting job
   */
  pause: () => void;
  /**
   * Pause and clear process queue
   */
  reset: () => void;
};

export const createProcessStore = <T = unknown>(immediateStart?: boolean) =>
  create(
    immer<IProcessStore<T>>((set, get) => {
      const maxPendingCount = 4;
      const getJobList = () => Array.from(get().process.values());
      const updateJob = (id: IJob<T>['id'], updateContent: Partial<IJob<T>>) =>
        set((store) => {
          if (!store.process.has(id)) return;
          Object.assign(store.process.get(id)!, updateContent);
        });
      const setJobState = (id: IJob<T>['id'], state: JOB_STATE) => updateJob(id, { state });

      const pauseJob = (job: IJob<T>) => setJobState(job.id, JOB_STATE.PAUSE);
      const resumeJob = (job: IJob<T>) => setJobState(job.id, JOB_STATE.WAITING);
      const cancelJob = (job: IJob<T>) =>
        set((store) => {
          store.process.delete(job.id);
          job.promiser.reject(undefined);
        });

      const checkWaitingJob = () => {
        const pendingJob = getJobList().filter((p) => p.state === JOB_STATE.PENDING);
        const waitingJob = getJobList().filter((p) => p.state === JOB_STATE.WAITING);

        let pendingJobLen = pendingJob.length;
        if (pendingJobLen >= maxPendingCount) return;

        while (pendingJobLen < maxPendingCount) {
          pendingJobLen++;
          const currentJob = waitingJob.shift();
          if (!currentJob) return;
          setJobState(currentJob.id, JOB_STATE.PENDING);
          currentJob
            .run(currentJob.actions)
            .then((...args) => {
              setJobState(currentJob.id, JOB_STATE.SUCCESS);
              currentJob.promiser.resolve(...args);
            })
            .catch((...args) => {
              setJobState(currentJob.id, JOB_STATE.FAIL);
              currentJob.promiser.reject(...args);
            });
        }
      };

      const append: IProcessStore<T>['append'] = (config) => {
        const { info, run, id = Symbol('id') } = config;
        const promiser = new Promiser();
        const actions: IProcessJobActions<T> = {
          cancel: () => cancelJob(job),
          pause: () => pauseJob(job),
          resume: () => resumeJob(job),
          setProgress: (progress) => updateJob(job.id, { progress }),
          setInfo: (info) => updateJob(job.id, { info }),
          getJob: () => get().process.get(job.id),
        };
        const job: IJob<T> = {
          id,
          info,
          state: JOB_STATE.WAITING,
          run,
          actions,
          promiser,
        };
        set((store) => {
          store.process.set(id, job as any);
        });
        return { ...actions, jobPromise: promiser.promise as ReturnType<typeof run> };
      };
      let timer: number | undefined;
      const start: IProcessStore<T>['start'] = (interval = 150) => {
        if (timer !== undefined) return;
        timer = window.setInterval(checkWaitingJob, interval);
      };
      const pause: IProcessStore<T>['pause'] = () => {
        window.clearInterval(timer);
        timer = undefined;
      };
      const reset: IProcessStore<T>['reset'] = () => {
        pause();
        set((store) => {
          store.process.clear();
          store.process = new Map();
        });
      };

      if (immediateStart) start();

      return {
        process: new Map(),
        append,
        start,
        pause,
        reset,
      };
    }),
  );
