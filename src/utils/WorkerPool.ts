/**
 * High-performance, multi-threaded Web Worker Pool
 * Manages an active pool of concurrent Web Workers to perform heavy botanical calculations
 * on background threads, ensuring the main UI thread never compromises in frames or animations.
 */

export interface WorkerTask {
  id: string;
  type: 'CALCULATE_DOSHA_ALIGNMENT' | 'HERB_PURITY_HASH' | 'KASHAYA_BOILING_RATIO';
  payload: any;
  workerName?: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  timestamp: string;
}

// Inline Web Worker self-executing function
const inlineWorkerCode = () => {
  self.onmessage = function (e: MessageEvent) {
    const { taskId, type, payload } = e.data;
    
    // Notify main thread that processing has started
    self.postMessage({ taskId, status: 'running', progress: 10 });

    try {
      if (type === 'CALCULATE_DOSHA_ALIGNMENT') {
        // High CPU matrix simulation for optimizing Herb-Dosha compatibility profiles
        let sum = 0;
        const loops = 15000000; // computational weight
        for (let i = 0; i < loops; i++) {
          sum += Math.sin(i) * Math.cos(i) + Math.sqrt(i % 100);
          if (i % 3000000 === 0) {
            self.postMessage({ taskId, status: 'running', progress: Math.min(90, Math.floor((i / loops) * 100)) });
          }
        }
        
        self.postMessage({
          taskId,
          status: 'completed',
          progress: 100,
          result: {
            alignmentScore: `${(85 + (Math.abs(sum) % 15)).toFixed(2)}%`,
            potencyVerification: 'Passed',
            synergyIndex: (4.5 + (Math.abs(sum) % 0.5)).toFixed(2),
            timestamp: new Date().toLocaleTimeString()
          }
        });
      } else if (type === 'HERB_PURITY_HASH') {
        // Simulates multi-pass cryptographic-like validation checks on organic raw batches
        let hash = 1952; // Est. 1952 seed
        const sampleStr = JSON.stringify(payload || {});
        const iterations = 40;
        
        for (let k = 0; k < iterations; k++) {
          for (let i = 0; i < sampleStr.length; i++) {
            hash = ((hash << 5) + hash) + sampleStr.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
          }
          if (k % 8 === 0) {
            self.postMessage({ taskId, status: 'running', progress: Math.floor((k / iterations) * 100) });
          }
        }

        self.postMessage({
          taskId,
          status: 'completed',
          progress: 100,
          result: {
            batchCertificate: `M-AYUR-${Math.abs(hash).toString(16).toUpperCase()}`,
            theriodynamicPurity: `${(98.4 + (Math.abs(hash) % 1.5)).toFixed(2)}%`,
            foreignMaterialRatio: `${(0.02 + (Math.abs(hash) % 0.05)).toFixed(3)}%`,
            timestamp: new Date().toLocaleTimeString()
          }
        });
      } else if (type === 'KASHAYA_BOILING_RATIO') {
        // Calculation of thermal reduction equations over gradual intervals
        let value = 1.0;
        const targetReduction = 0.25; // 1/4th decoction standard
        const steps = 12000000;
        
        for (let i = 0; i < steps; i++) {
          value = value - (value * 0.0000001);
          if (i % 2400000 === 0) {
            self.postMessage({ taskId, status: 'running', progress: Math.min(90, Math.floor((i / steps) * 100)) });
          }
        }

        self.postMessage({
          taskId,
          status: 'completed',
          progress: 100,
          result: {
            optimalReductionHours: '4.2 Hrs',
            firewoodThermalEfficiency: '92.4%',
            retainedAlkaloidsPercentage: '97.2%',
            timestamp: new Date().toLocaleTimeString()
          }
        });
      } else {
        self.postMessage({ 
          taskId, 
          status: 'completed', 
          progress: 100, 
          result: { message: 'Processed', timestamp: new Date().toLocaleTimeString() } 
        });
      }
    } catch (error: any) {
      self.postMessage({ taskId, status: 'failed', progress: 0, error: error.message });
    }
  };
};

export class ThreadWorkerPool {
  private workers: { id: number; worker: Worker; activeTaskId: string | null; name: string }[] = [];
  private taskQueue: { task: WorkerTask; resolve: (val: any) => void; reject: (err: any) => void }[] = [];
  private poolSize: number;
  private onTaskUpdateCallback?: (task: WorkerTask) => void;

  constructor(size: number = 3, onTaskUpdate?: (task: WorkerTask) => void) {
    this.poolSize = size;
    this.onTaskUpdateCallback = onTaskUpdate;
    this.initPool();
  }

  private initPool() {
    const workerNames = ['Shastri Lal', 'Vaidya Ramachandran', 'Acharya Devrat'];
    
    // Create string of self-executing inline URL for Web Worker
    const blobCode = `(${inlineWorkerCode.toString()})()`;
    const blob = new Blob([blobCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    for (let i = 0; i < this.poolSize; i++) {
      const workerInstance = new Worker(workerUrl);
      const workerName = workerNames[i] || `Apothecary Assistant ${i + 1}`;
      
      const workerRecord = {
        id: i,
        name: workerName,
        worker: workerInstance,
        activeTaskId: null as string | null
      };

      workerInstance.onmessage = (e: MessageEvent) => {
        const { taskId, status, progress, result, error } = e.data;
        const queueItem = this.taskQueue.find(q => q.task.id === taskId) || this.currentActiveQueueItem(taskId);
        
        if (queueItem) {
          queueItem.task.status = status;
          queueItem.task.progress = progress;
          queueItem.task.workerName = workerName;
          
          if (status === 'completed') {
            queueItem.task.result = result;
            workerRecord.activeTaskId = null;
            queueItem.resolve(result);
            this.removeTaskFromQueue(taskId);
            this.runNext();
          } else if (status === 'failed') {
            queueItem.task.result = { error };
            workerRecord.activeTaskId = null;
            queueItem.reject(new Error(error));
            this.removeTaskFromQueue(taskId);
            this.runNext();
          }
          
          if (this.onTaskUpdateCallback) {
            this.onTaskUpdateCallback({ ...queueItem.task });
          }
        }
      };

      this.workers.push(workerRecord);
    }
  }

  private currentActiveQueueItem(taskId: string) {
    // Looks for items that might be active in running status
    return this.taskQueue.find(q => q.task.id === taskId);
  }

  private removeTaskFromQueue(taskId: string) {
    const idx = this.taskQueue.findIndex(q => q.task.id === taskId);
    if (idx !== -1) {
      this.taskQueue.splice(idx, 1);
    }
  }

  public getWorkersList() {
    return this.workers.map(w => ({
      name: w.name,
      id: w.id,
      isIdle: w.activeTaskId === null,
      activeTaskId: w.activeTaskId
    }));
  }

  public submitTask(type: 'CALCULATE_DOSHA_ALIGNMENT' | 'HERB_PURITY_HASH' | 'KASHAYA_BOILING_RATIO', payload: any): Promise<any> {
    const taskId = `task-${Math.random().toString(36).substr(2, 9)}`;
    const task: WorkerTask = {
      id: taskId,
      type,
      payload,
      status: 'queued',
      progress: 0,
      timestamp: new Date().toLocaleTimeString()
    };

    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      if (this.onTaskUpdateCallback) {
        this.onTaskUpdateCallback({ ...task });
      }
      this.runNext();
    });
  }

  private runNext() {
    // Find an idle worker
    const idleWorker = this.workers.find(w => w.activeTaskId === null);
    if (!idleWorker) return; // All workers busy

    // Find first queued task in the queue
    const nextQueueItem = this.taskQueue.find(q => q.task.status === 'queued');
    if (!nextQueueItem) return;

    // Assign to worker
    idleWorker.activeTaskId = nextQueueItem.task.id;
    nextQueueItem.task.status = 'running';
    nextQueueItem.task.workerName = idleWorker.name;

    if (this.onTaskUpdateCallback) {
      this.onTaskUpdateCallback({ ...nextQueueItem.task });
    }

    idleWorker.worker.postMessage({
      taskId: nextQueueItem.task.id,
      type: nextQueueItem.task.type,
      payload: nextQueueItem.task.payload
    });
  }

  public terminate() {
    this.workers.forEach(w => w.worker.terminate());
    this.workers = [];
    this.taskQueue = [];
  }
}
