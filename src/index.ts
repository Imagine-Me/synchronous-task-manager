interface TaskType {
  [key: string]: any;
}

interface ProcessType {
  _id: number;
  _isCompleted: boolean;
  [key: string]: any;
}

type callBack = ((val: TaskType) => void) | null;

export class SynchronousTaskManager {
  _taskId: number = 0;
  _processQueue: ProcessType[] = [];
  _processing: number = 0;
  _callback: callBack = null;
  _stateCallback: ((prev: any, next: any) => any) | null = null;
  _processingStatus: boolean = false;
  _state: any = null;

  get state() {
    return this._state;
  }

  setState(callback: (val: any) => any) {
    const prev: any = this._state;
    this._state = callback(this._state);
    if (this._stateCallback) {
      this._stateCallback(prev, this._state);
    }
  }

  onStateChange(callback: (prev: any, next: any) => any) {
    this._stateCallback = callback;
  }

  add(task: TaskType) {
    this._processQueue.push({
      _id: this._taskId,
      _isCompleted: false,
      ...task,
    });
    if (!this._processingStatus && this._taskId === this._processing) {
      this.processTask();
    }
    this._taskId++;
  }

  addAll(tasks: TaskType[]) {
    for (const task of tasks) {
      this._processQueue.push({
        _id: this._taskId,
        _isCompleted: false,
        ...task,
      });
      if (!this._processingStatus && this._taskId === this._processing) {
        this.processTask();
      }
      this._taskId++;
    }
  }

  complete() {
    if (this._processing < this._processQueue.length) {
      this._processQueue[this._processing]._isCompleted = true;
      this.processTask();
    }
  }

  listen(callback: callBack) {
    this._callback = callback;
    if (this._taskId > 0) {
      this.processTask();
    }
  }

  processTask() {
    if (this._callback) {
      const currentProcess = { ...this._processQueue[this._processing] };
      this._processing++;
      if (this._processing < this._processQueue.length) {
        this._processingStatus = true;
      } else {
        this._processingStatus = false;
      }
      this._callback(currentProcess);
    }
  }
}

export const synchronousTaskQueue = new SynchronousTaskManager();