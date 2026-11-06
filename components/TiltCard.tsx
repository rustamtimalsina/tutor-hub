import React from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(124,58,237,0.18)] dark:hover:shadow-[0_12px_40px_-8px_rgba(139,92,246,0.25)] ${className}`}
    >
      {/* Subtle border glow halo behind the card (never obscuring content) */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary-500/0 via-primary-500/25 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
