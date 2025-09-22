import { ReactNode } from 'react';

interface PhotoFrameMinangProps {
  children: ReactNode;
  variant?: 'royal-gold' | 'emerald';
  density?: 'rich' | 'light';
  crest?: 'gonjong' | 'none';
  className?: string;
}

export default function PhotoFrameMinang({ 
  children, 
  variant = 'royal-gold', 
  density = 'rich',
  crest = 'none',
  className = '' 
}: PhotoFrameMinangProps) {

  return (
    <div className={`relative ${className}`} data-testid="photo-frame-minang">
      {/* Outer Gold Frame */}
      <div 
        className="relative p-8 rounded-lg shadow-2xl"
        style={{ 
          background: `linear-gradient(145deg, 
            hsl(var(--minang-gold-highlight)) 0%, 
            hsl(var(--minang-gold-primary)) 30%, 
            hsl(var(--minang-gold-shadow)) 70%, 
            hsl(var(--minang-gold-primary)) 100%)`,
          boxShadow: `
            0 12px 32px rgba(0,0,0,0.3),
            0 6px 12px rgba(0,0,0,0.2),
            inset 0 1px 0 hsl(var(--minang-gold-highlight) / 0.6),
            inset 0 -1px 0 hsl(var(--minang-gold-shadow) / 0.8)
          `
        }}
      >
        
        {/* Inner Gold Border */}
        <div 
          className="relative p-1 rounded"
          style={{ 
            background: `linear-gradient(145deg, 
              hsl(var(--minang-gold-shadow)) 0%, 
              hsl(var(--minang-gold-primary)) 50%, 
              hsl(var(--minang-gold-highlight)) 100%)`,
            boxShadow: `inset 0 1px 2px rgba(0,0,0,0.3)`
          }}
        >
          
          {/* Dark Mat */}
          <div 
            className="relative p-6 rounded"
            style={{ 
              background: `linear-gradient(135deg, 
                hsl(var(--minang-wood-deep)) 0%, 
                hsl(var(--minang-wood-base)) 100%)`,
              boxShadow: `
                inset 0 2px 6px rgba(0,0,0,0.4),
                inset 0 0 0 1px rgba(0,0,0,0.2)
              `
            }}
          >
            
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded shadow-xl">
              <div 
                className="absolute inset-0"
                style={{ 
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' 
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full" style={{ background: `hsl(var(--minang-gold-highlight))`, boxShadow: `0 1px 2px rgba(0,0,0,0.3)` }} />
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full" style={{ background: `hsl(var(--minang-gold-highlight))`, boxShadow: `0 1px 2px rgba(0,0,0,0.3)` }} />
        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full" style={{ background: `hsl(var(--minang-gold-highlight))`, boxShadow: `0 1px 2px rgba(0,0,0,0.3)` }} />
        <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full" style={{ background: `hsl(var(--minang-gold-highlight))`, boxShadow: `0 1px 2px rgba(0,0,0,0.3)` }} />
        
        {/* Subtle decorative shine effect */}
        <div 
          className="absolute -top-2 -right-2 w-16 h-16 rounded-full blur-xl opacity-20"
          style={{ 
            background: `radial-gradient(circle, 
              hsl(var(--minang-gold-highlight)) 0%, 
              transparent 70%)` 
          }}
        />
      </div>
    </div>
  );
}