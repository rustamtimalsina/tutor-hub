import React from 'react';
import { ShieldCheck, Star, Users, Zap, Award } from 'lucide-react';

export const LiveMetricsBar: React.FC = () => {
  const metrics = [
    {
      icon: <Users className="h-4 w-4 text-primary-400" />,
      label: '1,450+ Lessons Completed',
      sub: 'Across Nepal in 2026',
    },
    {
      icon: <Star className="h-4 w-4 text-amber-400 fill-amber-400" />,
      label: '4.92 / 5.0 Rating',
      sub: 'Verified Student Reviews',
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />,
      label: '100% Escrow Protection',
      sub: 'Funds released after class',
    },
    {
      icon: <Zap className="h-4 w-4 text-cyan-400" />,
      label: 'Khalti & eSewa Ready',
      sub: 'Instant digital checkout',
    },
    {
      icon: <Award className="h-4 w-4 text-purple-400" />,
      label: 'Top 1% STEM Mentors',
      sub: 'IOE Pulchowk & KU Alumni',
    },
  ];

  return (
    <div className="w-full relative z-20 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-r from-primary-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Subtle moving radial glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative bg-slate-900/90 dark:bg-slate-950/90 rounded-[14px] sm:rounded-[22px] py-4 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 items-center">
            {metrics.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 ${
                  idx > 0 ? 'pt-3 md:pt-0 md:pl-4' : ''
                } ${idx === 4 ? 'col-span-2 md:col-span-1 justify-center md:justify-start' : ''}`}
              >
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                    {item.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMetricsBar;
