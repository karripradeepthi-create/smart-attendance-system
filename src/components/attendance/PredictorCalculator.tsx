import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Calculator, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PredictorCalculatorProps {
  initialAttended?: number;
  initialTotal?: number;
}

export const PredictorCalculator: React.FC<PredictorCalculatorProps> = ({
  initialAttended = 34,
  initialTotal = 50,
}) => {
  const [attended, setAttended] = useState(initialAttended);
  const [totalHeld, setTotalHeld] = useState(initialTotal);
  const [targetPercentage, setTargetPercentage] = useState(75);

  const currentPercentage = totalHeld > 0 ? parseFloat(((attended / totalHeld) * 100).toFixed(1)) : 0;

  // Classes needed = ceil((target * totalHeld - 100 * attended) / (100 - target))
  const calculateClassesNeeded = () => {
    if (currentPercentage >= targetPercentage) return 0;
    const numerator = targetPercentage * totalHeld - 100 * attended;
    const denominator = 100 - targetPercentage;
    if (denominator <= 0) return 0;
    return Math.max(0, Math.ceil(numerator / denominator));
  };

  // How many classes can safely be missed without dropping below target?
  // (attended) / (totalHeld + y) >= target / 100
  // 100 * attended >= target * totalHeld + target * y
  // y <= (100 * attended - target * totalHeld) / target
  const calculateBunkableClasses = () => {
    if (currentPercentage < targetPercentage) return 0;
    const numerator = 100 * attended - targetPercentage * totalHeld;
    return Math.max(0, Math.floor(numerator / targetPercentage));
  };

  const needed = calculateClassesNeeded();
  const canSkip = calculateBunkableClasses();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Attendance Forecaster & Eligibility Predictor
            </h4>
            <p className="text-xs text-slate-500">
              Deterministic mathematical projection for semester attendance recovery
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Classes Attended
          </label>
          <input
            type="number"
            min={0}
            max={totalHeld}
            value={attended}
            onChange={(e) => setAttended(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Total Classes Conducted
          </label>
          <input
            type="number"
            min={1}
            value={totalHeld}
            onChange={(e) => setTotalHeld(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Target Threshold %
          </label>
          <select
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(parseInt(e.target.value))}
            className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value={75}>75% (Standard Exam Cutoff)</option>
            <option value={80}>80% (Distinction Goal)</option>
            <option value={85}>85% (Scholarship Tier)</option>
            <option value={90}>90% (Honor Roll)</option>
          </select>
        </div>
      </div>

      {/* Projection Visualization Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Current Status</span>
            <span
              className={`text-2xl font-black font-mono tabular-nums ${
                currentPercentage < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {currentPercentage}%
            </span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-400" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Goal</span>
            <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
              {targetPercentage}%
            </span>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-5 flex-1">
          {currentPercentage < targetPercentage ? (
            <div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                You must attend the next:
              </span>
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                {needed} consecutive classes
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Will yield {attended + needed} / {totalHeld + needed} = {(((attended + needed) / (totalHeld + needed)) * 100).toFixed(1)}%
              </span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Target Surpassed!
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                You can afford to miss up to <strong className="font-mono text-slate-900 dark:text-white">{canSkip}</strong> classes and still preserve your {targetPercentage}% eligibility.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
