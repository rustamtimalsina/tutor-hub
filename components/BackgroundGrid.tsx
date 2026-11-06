import React from 'react';

interface BackgroundGridProps {
  type?: 'dots' | 'grid';
  className?: string;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  type = 'grid',
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
    >
      {type === 'grid' ? (
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(124, 58, 237, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(124, 58, 237, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 30%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 30%, #000 70%, transparent 100%)',
          }}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 60%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
};

export default BackgroundGrid;
