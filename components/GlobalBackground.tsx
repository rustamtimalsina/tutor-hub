import React from 'react';

export const GlobalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Canvas */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#060813] transition-colors duration-700" />

      {/* 2. 21st.dev / Aceternity True Aurora Flow Layers */}
      <div className="absolute inset-0 overflow-hidden opacity-45 dark:opacity-55 transition-opacity duration-700">
        <div
          className={`
            absolute -inset-[10px]
            [--white-gradient:repeating-linear-gradient(100deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.8)_7%,transparent_10%,transparent_12%,rgba(255,255,255,0.8)_15%)]
            [--dark-gradient:repeating-linear-gradient(100deg,rgba(6,8,19,0.95)_0%,rgba(6,8,19,0.95)_7%,transparent_10%,transparent_12%,rgba(6,8,19,0.95)_15%)]
            [--aurora:repeating-linear-gradient(100deg,#7c3aed_10%,#06b6d4_15%,#6366f1_20%,#c084fc_25%,#38bdf8_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[28px] sm:blur-[36px]
            after:content-[''] after:absolute after:inset-0
            after:[background-image:var(--white-gradient),var(--aurora)]
            dark:after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora
            after:[background-attachment:fixed]
            after:mix-blend-difference
            will-change-transform
            [mask-image:radial-gradient(ellipse_at_50%_15%,black_45%,transparent_85%)]
            WebkitMaskImage:radial-gradient(ellipse_at_50%_15%,black_45%,transparent_85%)
          `}
        />
      </div>

      {/* 3. Ambient Ambient Glow Orbs for Depth */}
      <div className="absolute -top-[15%] left-[15%] w-[600px] sm:w-[850px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-br from-primary-600/10 via-indigo-600/15 to-transparent dark:from-primary-600/20 dark:via-purple-900/20 dark:to-transparent blur-[130px] sm:blur-[160px] animate-pulse-glow" />
      <div className="absolute top-[25%] -right-[10%] w-[500px] sm:w-[750px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-bl from-cyan-400/10 via-sky-500/10 to-transparent dark:from-cyan-500/15 dark:via-indigo-950/20 dark:to-transparent blur-[140px] sm:blur-[170px]" />

      {/* 4. Precision Micro-Dot Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 25%, #000 45%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 25%, #000 45%, transparent 100%)',
        }}
      />

      {/* 5. Subtle Vignette Edge Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/5 dark:to-black/50" />

      {/* 6. Celestial Cosmos Stars (Dark mode only) */}
      <div className="hidden dark:block absolute inset-0">
        <span className="absolute top-[10%] left-[20%] w-1 h-1 rounded-full bg-white opacity-40 shadow-[0_0_4px_#ffffff] animate-pulse" />
        <span className="absolute top-[24%] right-[25%] w-1.5 h-1.5 rounded-full bg-indigo-300 opacity-50 shadow-[0_0_6px_#c7d2fe]" />
        <span className="absolute top-[42%] left-[10%] w-1 h-1 rounded-full bg-cyan-200 opacity-40" />
        <span
          className="absolute top-[65%] right-[15%] w-1 h-1 rounded-full bg-amber-200 opacity-40 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <span className="absolute top-[80%] left-[30%] w-1.5 h-1.5 rounded-full bg-purple-200 opacity-45 shadow-[0_0_5px_#e9d5ff]" />
        <span className="absolute top-[16%] right-[38%] w-0.5 h-0.5 rounded-full bg-white opacity-60" />
        <span className="absolute top-[52%] right-[30%] w-1 h-1 rounded-full bg-white opacity-30" />
      </div>
    </div>
  );
};

export default GlobalBackground;
