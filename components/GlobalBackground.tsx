import React from 'react';

export const GlobalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#070913] transition-colors duration-500" />

      {/* 2. Deep Space / Aurora Glow Orbs (Layered Mesh) */}
      <div className="absolute -top-[20%] left-[10%] w-[600px] sm:w-[900px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-br from-primary-600/10 via-indigo-600/15 to-transparent dark:from-primary-600/20 dark:via-purple-900/25 dark:to-transparent blur-[120px] sm:blur-[160px] animate-pulse-glow" />
      
      <div className="absolute top-[20%] -right-[10%] w-[500px] sm:w-[800px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-bl from-cyan-400/10 via-sky-500/10 to-transparent dark:from-cyan-500/15 dark:via-indigo-950/20 dark:to-transparent blur-[130px] sm:blur-[170px]" />
      
      <div className="absolute -bottom-[10%] left-[25%] w-[600px] sm:w-[850px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-tr from-purple-500/10 via-indigo-400/5 to-transparent dark:from-indigo-600/15 dark:via-primary-950/20 dark:to-transparent blur-[140px] sm:blur-[180px]" />

      {/* 3. 21st.dev Precision Micro-Dot Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.25) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 25%, #000 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 25%, #000 50%, transparent 100%)',
        }}
      />

      {/* 4. Subtle Radial Vignette for Depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/5 dark:to-black/40"
      />

      {/* 5. Delicate Cosmos Stars (Dark mode only) */}
      <div className="hidden dark:block absolute inset-0">
        <span className="absolute top-[12%] left-[18%] w-1 h-1 rounded-full bg-white opacity-40 shadow-[0_0_4px_#ffffff] animate-pulse" />
        <span className="absolute top-[28%] right-[22%] w-1.5 h-1.5 rounded-full bg-indigo-300 opacity-50 shadow-[0_0_6px_#c7d2fe]" />
        <span className="absolute top-[45%] left-[8%] w-1 h-1 rounded-full bg-cyan-200 opacity-40" />
        <span className="absolute top-[68%] right-[14%] w-1 h-1 rounded-full bg-amber-200 opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
        <span className="absolute top-[82%] left-[35%] w-1.5 h-1.5 rounded-full bg-purple-200 opacity-45 shadow-[0_0_5px_#e9d5ff]" />
        <span className="absolute top-[18%] right-[40%] w-0.5 h-0.5 rounded-full bg-white opacity-60" />
        <span className="absolute top-[55%] right-[32%] w-1 h-1 rounded-full bg-white opacity-30" />
      </div>
    </div>
  );
};

export default GlobalBackground;
