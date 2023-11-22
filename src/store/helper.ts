import { Promiser } from '@/helper';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

export enum PROCESS_STATE {
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
  setProgress: (progress: IProcess<unknown>['progress']) => void;
  setInfo: (info: IProcess<T>['info']) => void;
  getProcess: () => IProcess<T> | undefined;
};

export type IProcess<T> = {
  id: string | symbol;
  info: T;
  state: PROCESS_STATE;
  progress?: number;
  job: (actions: IProcessJobActions<T>) => Promise<unknown>;
  promiser: Promiser<unknown>;
  actions: IProcessJobActions<T>;
};

export type IProcessStore<T> = {
  state: {
    process: Map<IProcess<T>['id'], IProcess<T>>;
  };
  append: <P = unknown>(
    info: T,
    job: (actions: IProcessJobActions<T>) => Promise<P>,
  ) => IProcessJobActions<T> & { job: Promise<P> };
};

export const createProcessStore = <T = unknown>() =>
  create(
    immer<IProcessStore<T>>((set, get) => {
      const maxPendingCount = 4;
      const getProcessList = () => Array.from(get().state.process.values());
      const updateProcess = (id: IProcess<T>['id'], updateContent: Partial<IProcess<T>>) =>
        set((store) => {
          if (!store.state.process.has(id)) return;
          Object.assign(store.state.process.get(id)!, updateContent);
        });
      const setProcessState = (id: IProcess<T>['id'], state: PROCESS_STATE) =>
        updateProcess(id, { state });

      const pauseProcess = (process: IProcess<T>) =>
        setProcessState(process.id, PROCESS_STATE.PAUSE);
      const resumeProcess = (process: IProcess<T>) =>
        setProcessState(process.id, PROCESS_STATE.WAITING);
      const cancelProcess = (process: IProcess<T>) =>
        set((store) => {
          store.state.process.delete(process.id);
          process.promiser.reject(undefined);
        });

      const checkWaitingJob = () => {
        const pendingJob = getProcessList().filter((p) => p.state === PROCESS_STATE.PENDING);
        const waitingJob = getProcessList().filter((p) => p.state === PROCESS_STATE.WAITING);

        let pendingJobLen = pendingJob.length;
        if (pendingJobLen >= maxPendingCount) return;

        while (pendingJobLen < maxPendingCount) {
          pendingJobLen++;
          const p = waitingJob.shift();
          if (!p) return;
          setProcessState(p.id, PROCESS_STATE.PENDING);
          p.job(p.actions)
            .then((...args) => {
              setProcessState(p.id, PROCESS_STATE.SUCCESS);
              p.promiser.resolve(...args);
            })
            .catch((...args) => {
              setProcessState(p.id, PROCESS_STATE.FAIL);
              p.promiser.reject(...args);
            });
        }
      };

      setInterval(checkWaitingJob, 250);

      return {
        state: {
          process: new Map(),
        },
        append: (info, job, id: IProcess<T>['id'] = Symbol('id')) => {
          const promiser = new Promiser();
          const actions: IProcessJobActions<T> = {
            cancel: () => cancelProcess(process),
            pause: () => pauseProcess(process),
            resume: () => resumeProcess(process),
            setProgress: (progress) => updateProcess(process.id, { progress }),
            setInfo: (info) => updateProcess(process.id, { info }),
            getProcess: () => get().state.process.get(process.id),
          };
          const process: IProcess<T> = {
            id,
            info,
            state: PROCESS_STATE.WAITING,
            job,
            actions,
            promiser,
          };

          set((store) => {
            store.state.process.set(id, process as any);
          });

          return { ...actions, job: promiser.promise as ReturnType<typeof job> };
        },
      };
    }),
  );
