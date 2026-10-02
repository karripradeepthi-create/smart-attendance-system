import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  description?: string;
  icon?: React.ReactNode;
  warning?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  description,
  icon,
  warning = false,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden transition-all ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''
      } ${warning ? 'border-amber-300/80 bg-amber-50/20 dark:bg-amber-950/10' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className={`text-2xl lg:text-3xl font-bold tracking-tight tabular-nums ${
                warning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {value}
            </span>
            {change && (
              <span
                className={`text-xs font-medium tabular-nums ${
                  isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
