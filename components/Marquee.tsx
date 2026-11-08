import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = 'left',
  speed = 35,
  pauseOnHover = true,
  className = '',
}) => {
  return (
    <div
      className={`group relative flex overflow-hidden p-2 [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,1)_4%,rgba(0,0,0,1)_96%,transparent_100%)] ${className}`}
    >
      <div
        className={`flex min-w-full shrink-0 items-center justify-around gap-6 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center justify-around gap-6 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  );
};

export default Marquee;
