import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 ${
        hoverEffect
          ? 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
