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
  crest = 'gonjong',
  className = '' 
}: PhotoFrameMinangProps) {
  
  // SVG Ornament Components
  const GonjongCrest = () => (
    <svg 
      width="80" 
      height="60" 
      viewBox="0 0 80 60" 
      className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
    >
      {/* Gonjong (Buffalo Horn) Crest */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: `hsl(var(--minang-gold-highlight))`, stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: `hsl(var(--minang-gold-primary))`, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: `hsl(var(--minang-gold-shadow))`, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Main Gonjong Shape */}
      <path 
        d="M40 10 L20 50 L25 52 L40 15 L55 52 L60 50 Z" 
        fill="url(#goldGradient)" 
        stroke={`hsl(var(--minang-gold-shadow))`} 
        strokeWidth="1"
      />
      
      {/* Central Diamond */}
      <path 
        d="M40 25 L35 35 L40 45 L45 35 Z" 
        fill={`hsl(var(--minang-gold-highlight))`} 
        stroke={`hsl(var(--minang-gold-shadow))`} 
        strokeWidth="0.5"
      />
      
      {/* Small ornamental dots */}
      <circle cx="32" cy="35" r="2" fill={`hsl(var(--minang-gold-highlight))`} />
      <circle cx="48" cy="35" r="2" fill={`hsl(var(--minang-gold-highlight))`} />
    </svg>
  );

  const CornerOrnament = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
    const positionClasses = {
      'top-left': '-top-3 -left-3',
      'top-right': '-top-3 -right-3 scale-x-[-1]',
      'bottom-left': '-bottom-3 -left-3 scale-y-[-1]',
      'bottom-right': '-bottom-3 -right-3 scale-[-1]'
    };

    return (
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        className={`absolute ${positionClasses[position]} z-20`}
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
      >
        <defs>
          <radialGradient id={`cornerGradient-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: `hsl(var(--minang-gold-highlight))`, stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: `hsl(var(--minang-gold-primary))`, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: `hsl(var(--minang-gold-shadow))`, stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        
        {/* Corner Rosette */}
        <circle 
          cx="16" 
          cy="16" 
          r="12" 
          fill={`url(#cornerGradient-${position})`} 
          stroke={`hsl(var(--minang-gold-shadow))`} 
          strokeWidth="1"
        />
        
        {/* Inner pattern */}
        <path 
          d="M16 8 L20 12 L16 16 L12 12 Z" 
          fill={`hsl(var(--minang-gold-highlight))`} 
          opacity="0.8"
        />
        <path 
          d="M16 16 L20 20 L16 24 L12 20 Z" 
          fill={`hsl(var(--minang-gold-shadow))`} 
          opacity="0.6"
        />
      </svg>
    );
  };

  const SongketBorder = () => (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Songket Tumpal Pattern Border */}
      <div 
        className="absolute inset-2 rounded-lg border-4"
        style={{ 
          borderColor: `hsl(var(--minang-gold-primary))`,
          borderImage: `repeating-linear-gradient(
            45deg,
            hsl(var(--minang-gold-primary)) 0,
            hsl(var(--minang-gold-primary)) 4px,
            hsl(var(--minang-gold-shadow)) 4px,
            hsl(var(--minang-gold-shadow)) 8px,
            hsl(var(--minang-gold-highlight)) 8px,
            hsl(var(--minang-gold-highlight)) 12px
          ) 1`,
          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
        }}
      >
        {/* Inner filigree pattern */}
        <div 
          className="absolute inset-1 rounded border-2"
          style={{ 
            borderColor: `hsl(var(--minang-gold-highlight))`,
            opacity: 0.7
          }}
        />
      </div>
      
      {/* Side ornamental diamonds */}
      <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div 
          className="w-4 h-4 rotate-45" 
          style={{ backgroundColor: `hsl(var(--minang-gold-primary))` }}
        />
      </div>
      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
        <div 
          className="w-4 h-4 rotate-45" 
          style={{ backgroundColor: `hsl(var(--minang-gold-primary))` }}
        />
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`} data-testid="photo-frame-minang">
      {/* Wood Base Layer */}
      <div 
        className="relative p-6 rounded-xl shadow-2xl"
        style={{ 
          background: `linear-gradient(135deg, 
            hsl(var(--minang-wood-base)) 0%, 
            hsl(var(--minang-wood-deep)) 50%, 
            hsl(var(--minang-wood-base)) 100%)`,
          boxShadow: `
            inset 0 1px 0 hsl(var(--minang-wood-base)),
            0 8px 24px rgba(0,0,0,0.4),
            0 4px 8px rgba(0,0,0,0.3)
          `
        }}
      >
        
        {/* Velvet Mat Layer */}
        <div 
          className="relative p-4 rounded-lg"
          style={{ 
            background: `linear-gradient(135deg, 
              hsl(var(--minang-velvet-oxblood)) 0%, 
              hsl(var(--minang-velvet-oxblood) / 0.9) 50%, 
              hsl(var(--minang-velvet-oxblood)) 100%)`,
            boxShadow: `
              inset 0 0 0 2px hsl(var(--minang-gold-primary) / 0.3),
              inset 0 2px 4px rgba(0,0,0,0.3)
            `
          }}
        >
          
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden rounded shadow-lg">
            <div 
              className="absolute inset-0"
              style={{ 
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.1)' 
              }}
            >
              {children}
            </div>
          </div>
        </div>
        
        {/* Ornamental Elements */}
        {crest === 'gonjong' && <GonjongCrest />}
        <CornerOrnament position="top-left" />
        <CornerOrnament position="top-right" />
        <CornerOrnament position="bottom-left" />
        <CornerOrnament position="bottom-right" />
        <SongketBorder />
        
        {/* Decorative blur effects */}
        <div 
          className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30"
          style={{ 
            background: `radial-gradient(circle, 
              hsl(var(--minang-gold-primary) / 0.4) 0%, 
              transparent 70%)` 
          }}
        />
      </div>
    </div>
  );
}