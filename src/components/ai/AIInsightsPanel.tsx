import React, { useEffect, useState } from 'react';
import { aiService, AIInsightResponse } from '../../services/aiService';
import { Card } from '../ui/Card';
import { Sparkles, RefreshCw, CheckCircle, Info } from 'lucide-react';

interface AIInsightsPanelProps {
  stats: any;
  role: string;
  context?: string;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ stats, role, context }) => {
  const [data, setData] = useState<AIInsightResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await aiService.getInsights({ stats, role, context });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [role]);

  return (
    <Card className="border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
      <div className="flex items-center justify-between pb-3 border-b border-indigo-100/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Smart Attendance Intelligence
              {data?.aiPowered && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  Gemini Flash 3.8
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500">
              Pattern analytics and automated student engagement highlights
            </p>
          </div>
        </div>

        <button
          onClick={loadInsights}
          disabled={loading}
          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Regenerate insights"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {loading ? (
          <div className="space-y-2 py-3">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-sm w-5/6 animate-pulse" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-sm w-4/6 animate-pulse" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-sm w-3/4 animate-pulse" />
          </div>
        ) : (
          data?.insights.map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" /> Grounded strictly in validated student attendance logs
        </span>
        {data?.message && <span className="text-[10px] text-slate-400">{data.message}</span>}
      </div>
    </Card>
  );
};
