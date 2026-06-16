import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreadWorkerPool, WorkerTask } from '../utils/WorkerPool';
import { Beaker, ShieldCheck, Flame, RotateCw, Play, CircleDot, ServerCrash, Layers, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function CompoundingWorkerPool() {
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [workersState, setWorkersState] = useState<{ name: string; id: number; isIdle: boolean; activeTaskId: string | null }[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const workerPoolRef = useRef<ThreadWorkerPool | null>(null);

  // Initialize Worker Pool on Mount
  useEffect(() => {
    // Instantiate ThreadWorkerPool with 3 active workers
    const pool = new ThreadWorkerPool(3, (updatedTask) => {
      setTasks(prev => {
        const index = prev.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          const next = [...prev];
          next[index] = updatedTask;
          return next;
        } else {
          return [updatedTask, ...prev];
        }
      });
    });

    workerPoolRef.current = pool;
    setWorkersState(pool.getWorkersList());

    // Periodically update worker states
    const timer = setInterval(() => {
      if (workerPoolRef.current) {
        setWorkersState(workerPoolRef.current.getWorkersList());
      }
    }, 400);

    return () => {
      clearInterval(timer);
      if (workerPoolRef.current) {
        workerPoolRef.current.terminate();
      }
    };
  }, []);

  const triggerTask = async (type: 'CALCULATE_DOSHA_ALIGNMENT' | 'HERB_PURITY_HASH' | 'KASHAYA_BOILING_RATIO') => {
    if (!workerPoolRef.current) return;
    
    // Simple custom payloads for each task
    let payload = {};
    if (type === 'CALCULATE_DOSHA_ALIGNMENT') {
      payload = { primaryDosha: 'Pitta-Vata', recommendedHerbs: ['Amrita', 'Guggulu', 'Shilajit', 'Brahmi'] };
    } else if (type === 'HERB_PURITY_HASH') {
      payload = { batchId: `B-${Math.floor(Math.random() * 9000 + 1000)}`, source: 'Upper Gangotri Sanctuary', moisturePercent: 4.12 };
    } else {
      payload = { herbalDecoctionWaterVolumeLiters: 16.0, targetVolumeLiters: 4.0, woodFireType: 'Sesame Wood Woodpile' };
    }

    try {
      if (workerPoolRef.current) {
        setWorkersState(workerPoolRef.current.getWorkersList());
      }
      await workerPoolRef.current.submitTask(type, payload);
    } catch (e) {
      console.error("Worker processing failed", e);
    }
  };

  const runAllSimulationsConcurrently = async () => {
    if (simulationRunning) return;
    setSimulationRunning(true);
    
    // Trigger 3 tasks concurrently to show the full beauty of the worker pool parallel scheduling
    triggerTask('CALCULATE_DOSHA_ALIGNMENT');
    setTimeout(() => triggerTask('HERB_PURITY_HASH'), 150);
    setTimeout(() => triggerTask('KASHAYA_BOILING_RATIO'), 350);

    // Queue 2 extra tasks to show queuing capability in our FIFO scheduler
    setTimeout(() => triggerTask('CALCULATE_DOSHA_ALIGNMENT'), 600);
    setTimeout(() => triggerTask('HERB_PURITY_HASH'), 850);

    setTimeout(() => {
      setSimulationRunning(false);
    }, 4000);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'CALCULATE_DOSHA_ALIGNMENT':
        return <Beaker className="w-4 h-4 text-purple-600" />;
      case 'HERB_PURITY_HASH':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'KASHAYA_BOILING_RATIO':
        return <Flame className="w-4 h-4 text-amber-600" />;
      default:
        return <Layers className="w-4 h-4 text-stone-600" />;
    }
  };

  const getTaskReadableName = (type: string) => {
    switch (type) {
      case 'CALCULATE_DOSHA_ALIGNMENT':
        return 'Synergy Matrix Alignment';
      case 'HERB_PURITY_HASH':
        return 'Theriodynamic Batch Purity Verification';
      case 'KASHAYA_BOILING_RATIO':
        return 'Decoction Reduction Factor Evaluation';
      default:
        return 'General Task';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2 py-0.5 rounded font-mono font-bold uppercase transition-all">
            <CheckCircle2 className="w-2.5 h-2.5" /> Ready
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[9px] bg-sky-50 text-sky-800 border border-sky-250 px-2 py-0.5 rounded font-mono font-bold uppercase animate-pulse">
            <RotateCw className="w-2.5 h-2.5 animate-spin" /> Blending
          </span>
        );
      case 'queued':
        return (
          <span className="flex items-center gap-1 text-[9px] bg-stone-100 text-stone-600 border border-stone-250 px-2 py-0.5 rounded font-mono font-bold uppercase">
            <CircleDot className="w-2.5 h-2.5" /> Waiting
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[9px] bg-rose-50 text-rose-800 border border-rose-250 px-2 py-0.5 rounded font-mono font-bold uppercase">
            <AlertCircle className="w-2.5 h-2.5" /> Halted
          </span>
        );
    }
  };

  return (
    <section id="apothecary-thread-laboratory" className="bg-[#fcfbf9] rounded-xl border border-amber-900/15 p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/10 pb-5">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#8a5a36] uppercase font-black block">
            Vedic Computations &amp; Multi-Threaded Compounding Lab
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-black text-amber-950 flex items-center gap-2">
            Traditional Apothecary Worker Pool
            <span className="text-xs bg-amber-100 border border-amber-900/15 px-2 py-0.5 rounded-full font-mono text-amber-900 font-bold hidden sm:inline-block">
              3 ACTIVE MAIN WEB WORKERS
            </span>
          </h3>
          <p className="text-xs font-serif text-stone-500 max-w-2xl leading-relaxed">
            In our digital Apothecary Lab, we spawn safe, dedicated high-performance background <strong>Web Workers</strong>. Raw element testing, ratio alignments, and heat equations are offloaded entirely from the browser's UI thread, ensuring zero frame rate drops or rendering lags.
          </p>
        </div>

        <button
          onClick={runAllSimulationsConcurrently}
          disabled={simulationRunning}
          className={`flex items-center gap-2 bg-[#4a3525] hover:bg-[#2d1b10] text-[#faf2e6] font-mono font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-lg transition-all shadow-3xs hover:shadow-xs active:scale-98 shrink-0 cursor-pointer ${
            simulationRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-[#faf2e6]" />
          Dispatch Batch Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: 3 Workers Status Panel */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-xs font-mono font-black text-amber-950 uppercase tracking-widest">
              Active Vaidyas (Thread Slots)
            </h4>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-4">
            {workersState.map((w) => (
              <div 
                key={w.id} 
                className={`p-3.5 rounded-lg border flex items-center justify-between transition-all duration-300 ${
                  !w.isIdle 
                    ? 'border-amber-900/20 bg-amber-50/20 ring-1 ring-amber-900/5' 
                    : 'border-stone-100 bg-stone-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${!w.isIdle ? 'bg-amber-100' : 'bg-stone-200'} transition-colors`}>
                    <Beaker className={`w-4 h-4 ${!w.isIdle ? 'text-amber-900' : 'text-stone-500'}`} />
                  </div>
                  <div className="text-left font-serif">
                    <span className="block text-xs font-bold text-stone-900">{w.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {w.id === 0 ? 'Remedy Extraction Expert' : w.id === 1 ? 'Precision Grinder' : 'Purity Inspector'}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 font-mono">
                  <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded leading-none ${
                    !w.isIdle 
                      ? 'bg-amber-800 text-white animate-pulse' 
                      : 'bg-stone-100 text-stone-500'
                  }`}>
                    {!w.isIdle ? 'COMPOUNDING' : 'IDLE'}
                  </span>
                  {!w.isIdle && (
                    <span className="text-[8px] text-amber-905">{w.activeTaskId?.substring(0, 10)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[10px] text-stone-500 font-mono">
            <span>Concurrency Level:</span>
            <span className="font-bold text-stone-850">3 Hardware Workers</span>
          </div>
        </div>

        {/* Middle/Right: Live Task Processing Console */}
        <div className="lg:col-span-2 bg-[#120d09] rounded-xl border border-stone-800 p-5 md:p-6 text-[#efede9] font-mono space-y-5 shadow-inner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#ead8c5]">
                Compounding Real-Time task Queue
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => triggerTask('CALCULATE_DOSHA_ALIGNMENT')}
                className="bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-purple-200/90 text-[10px] rounded px-2.5 py-1 transition-colors cursor-pointer"
              >
                + Synergy Alignment
              </button>
              <button
                onClick={() => triggerTask('HERB_PURITY_HASH')}
                className="bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-250 text-[10px] rounded px-2.5 py-1 transition-colors cursor-pointer"
              >
                + verify Purity
              </button>
              <button
                onClick={() => triggerTask('KASHAYA_BOILING_RATIO')}
                className="bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-200/90 text-[10px] rounded px-2.5 py-1 transition-colors cursor-pointer"
              >
                + Reduction Factor
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {tasks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center text-stone-500 text-xs flex flex-col items-center justify-center gap-2"
                >
                  <Sparkles className="w-8 h-8 text-stone-700 stroke-[1]" />
                  <span>Apothecary Lab engine idle. Trigger a task, or dispatch batch to observe.</span>
                </motion.div>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key={task.id}
                    className="bg-[#1a1410] rounded-lg border border-neutral-800 p-4 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-[#241c16] p-1.5 rounded border border-neutral-850">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold text-stone-200">
                            {getTaskReadableName(task.type)}
                          </span>
                          <span className="text-[9px] text-[#8a5a36] uppercase tracking-wider font-bold">
                            ID: {task.id} • Registered {task.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1 sm:mt-0">
                        {task.workerName && (
                          <span className="text-[9px] text-amber-200/70 border border-amber-800/20 px-1.5 py-0.5 rounded bg-amber-950/30">
                            👤 {task.workerName}
                          </span>
                        )}
                        {getStatusBadge(task.status)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {task.status === 'running' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-stone-400">
                          <span>Distilling elements...</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${task.progress}%` }}
                            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Result Output */}
                    {task.status === 'completed' && task.result && (
                      <div className="bg-[#120d09] border border-neutral-850/80 rounded p-2.5 text-[10px] text-[#ead8c5] space-y-1">
                        <div className="text-[#a49180] border-b border-stone-850/40 pb-1 mb-1 flex items-center justify-between">
                          <span>🔬 PARALLEL THREAD CALCULATION OUTPUT:</span>
                          <span className="text-[9px] bg-emerald-900/30 text-emerald-300 font-bold px-1 rounded">MATCHED</span>
                        </div>
                        {task.type === 'CALCULATE_DOSHA_ALIGNMENT' && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div>Herb Harmony Index: <span className="text-amber-400 font-bold">{task.result.alignmentScore}</span></div>
                            <div>Synergy Factor: <span className="text-amber-400 font-bold">{task.result.synergyIndex}</span></div>
                            <div>Verification: <span className="text-emerald-400">{task.result.potencyVerification}</span></div>
                            <div>Time Completed: <span className="text-stone-400">{task.result.timestamp}</span></div>
                          </div>
                        )}
                        {task.type === 'HERB_PURITY_HASH' && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div>Atm. Purity Certificate: <span className="text-amber-400 font-bold">{task.result.batchCertificate}</span></div>
                            <div>Batch Clean Ratio: <span className="text-amber-400 font-bold">{task.result.theriodynamicPurity}</span></div>
                            <div>Total Foreign Mass: <span className="text-amber-400 font-bold">{task.result.foreignMaterialRatio}</span></div>
                            <div>Time Completed: <span className="text-stone-400">{task.result.timestamp}</span></div>
                          </div>
                        )}
                        {task.type === 'KASHAYA_BOILING_RATIO' && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div>Decoction Reduction Hrs: <span className="text-amber-400 font-bold">{task.result.optimalReductionHours}</span></div>
                            <div>Furnace Heat Ratio: <span className="text-amber-400 font-bold">{task.result.firewoodThermalEfficiency}</span></div>
                            <div>Preserved Alkaloids: <span className="text-[#89f5bc]">{task.result.retainedAlkaloidsPercentage}</span></div>
                            <div>Time Completed: <span className="text-stone-400">{task.result.timestamp}</span></div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
