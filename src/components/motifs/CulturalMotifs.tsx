import React from 'react';

/**
 * TempleToranam: Sacred auspicious mango leaves (మామిడాకుల తోరణం) and marigold garland (బంతి పూల దండ)
 * Traditionally hung at temple thresholds and river ghat entrance portals for auspicious protection.
 */
export const TempleToranam: React.FC<{ className?: string }> = ({ className = 'w-full h-7' }) => (
  <svg viewBox="0 0 800 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    {/* Hanging Holy Jute Thread */}
    <line x1="0" y1="4" x2="800" y2="4" stroke="var(--color-haldi)" strokeWidth="2.5" />
    <line x1="0" y1="6" x2="800" y2="6" stroke="var(--color-kumkum)" strokeWidth="1.5" strokeDasharray="6 4" />

    {/* Repeating Mango Leaves and Golden Marigolds */}
    {Array.from({ length: 16 }).map((_, i) => {
      const x = i * 50 + 25;
      return (
        <g key={i}>
          {/* Mango Leaf */}
          <path
            d={`M ${x - 12} 6 C ${x - 14} 15, ${x - 4} 24, ${x} 27 C ${x + 4} 24, ${x + 14} 15, ${x + 12} 6 Z`}
            fill="var(--color-tulsi)"
            stroke="var(--color-mitti)"
            strokeWidth="0.8"
          />
          <line x1={x} y1="6" x2={x} y2="24" stroke="#254B22" strokeWidth="0.8" />
          {/* Marigold Flower Ball */}
          <circle cx={x + 25} cy="9" r="6" fill="var(--color-haldi)" stroke="var(--color-kesari)" strokeWidth="1" />
          <circle cx={x + 25} cy="9" r="3" fill="var(--color-kumkum)" opacity="0.8" />
        </g>
      );
    })}
  </svg>
);

/**
 * GopuramSilhouette: Majestic multi-tiered temple tower silhouette overlooking Rajamahendravaram ghats.
 */
export const GopuramSilhouette: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    {/* Distant Temple Towers and Riverbank */}
    <path
      d="M 170 120 L 175 75 L 180 75 L 182 45 L 186 45 L 190 25 L 196 25 L 198 12 L 202 12 L 204 25 L 210 25 L 214 45 L 218 45 L 220 75 L 225 75 L 230 120 Z"
      fill="currentColor"
      opacity="0.16"
    />
    <path
      d="M 182 45 H 218 M 186 60 H 214 M 180 75 H 220 M 176 95 H 224"
      stroke="currentColor"
      strokeWidth="1.2"
      opacity="0.3"
    />
    {/* Kalash on spire */}
    <circle cx="200" cy="8" r="4" fill="var(--color-haldi)" opacity="0.85" />
    <path d="M 200 4 L 200 1" stroke="var(--color-haldi)" strokeWidth="1.8" />
    {/* Secondary Temple Shikhara Silhouettes */}
    <path d="M 90 120 L 95 85 L 105 85 L 110 120 Z" fill="currentColor" opacity="0.1" />
    <path d="M 290 120 L 295 85 L 305 85 L 310 120 Z" fill="currentColor" opacity="0.1" />
    {/* Subtle River Horizon */}
    <path
      d="M 0 115 Q 100 108 200 115 T 400 115"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.25"
    />
  </svg>
);

/**
 * DiyaIcon: Sacred brass/mitti oil lamp with radiant flickering flame.
 */
export const DiyaIcon: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Earthen/Brass Body */}
    <path
      d="M 5 18 C 5 26 27 26 27 18 C 27 14 21 13 16 13 C 11 13 5 14 5 18 Z"
      fill="var(--color-mitti)"
      stroke="var(--color-kesari)"
      strokeWidth="1.6"
    />
    <ellipse cx="16" cy="15" rx="9" ry="2.5" fill="var(--color-haldi)" opacity="0.85" />
    {/* Holy Flame */}
    <path
      d="M 16 3 C 20 8.5 23 12 19.5 15 C 18 16 14 16 12.5 15 C 9 12 12 8.5 16 3 Z"
      fill="var(--color-kesari)"
    />
    <path
      d="M 16 6 C 18.5 9.5 20.5 12 18.5 13.5 C 17.5 14 14.5 14 13.5 13.5 C 11.5 12 13.5 9.5 16 6 Z"
      fill="var(--color-haldi)"
    />
    <ellipse cx="16" cy="12" rx="1.8" ry="2.2" fill="#FFFDF8" />
  </svg>
);

/**
 * DeepaStambham: Traditional south Indian temple brass lamp pillar (దీపస్తంభం).
 */
export const DeepaStambham: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pillar Base */}
    <path d="M 6 44 L 26 44 L 22 38 L 10 38 Z" fill="var(--color-mitti)" stroke="var(--color-kesari)" strokeWidth="1" />
    {/* Pillar Shaft */}
    <line x1="16" y1="10" x2="16" y2="38" stroke="var(--color-haldi)" strokeWidth="3" />
    {/* Tier 1 Lamp Tray */}
    <ellipse cx="16" cy="30" rx="10" ry="2.5" fill="var(--color-kesari)" />
    <path d="M 6 28 C 6 25 7 24 8 28 Z M 26 28 C 26 25 25 24 24 28 Z" fill="var(--color-haldi)" />
    {/* Tier 2 Lamp Tray */}
    <ellipse cx="16" cy="20" rx="8" ry="2" fill="var(--color-kesari)" />
    <path d="M 8 18 C 8 15 9 14 10 18 Z M 24 18 C 24 15 23 14 22 18 Z" fill="var(--color-haldi)" />
    {/* Top Crowning Diya & Flame */}
    <ellipse cx="16" cy="10" rx="6" ry="2" fill="var(--color-haldi)" />
    <path d="M 16 2 C 18 5 19 7 17 8.5 C 16 9 15 9 14 8.5 C 12 7 14 5 16 2 Z" fill="var(--color-kumkum)" />
  </svg>
);

/**
 * ShankhaIcon: Sacred conch shell (శంఖం / शंख).
 */
export const ShankhaIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M 6 18 C 3 13 4 7 10 4 C 16 1 21 6 20 12 C 19 18 13 21 8 20 C 6 19.5 5 19 6 18 Z"
      fill="var(--color-chandan)"
      stroke="var(--color-kesari)"
      strokeWidth="1.5"
    />
    <path d="M 10 5 C 14 4 18 7 17 12 C 16 16 12 18 9 17" stroke="var(--color-haldi)" strokeWidth="1.2" />
    <circle cx="12" cy="11" r="2.5" fill="var(--color-haldi)" opacity="0.6" />
  </svg>
);

/**
 * LotusIcon: Sacred lotus representing purity, divinity and peaceful reunion.
 */
export const LotusIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Center petal */}
    <path d="M 12 2 C 14.5 7 14.5 13 12 18 C 9.5 13 9.5 7 12 2 Z" fill="var(--color-kesari)" opacity="0.9" />
    {/* Left petal */}
    <path d="M 12 7 C 7.5 8 4.5 12 6.5 18 C 8.5 17 11 15 12 13.5 Z" fill="var(--color-haldi)" opacity="0.8" />
    {/* Right petal */}
    <path d="M 12 7 C 16.5 8 19.5 12 17.5 18 C 15.5 17 13 15 12 13.5 Z" fill="var(--color-haldi)" opacity="0.8" />
    {/* Leaf Base */}
    <path d="M 4 19 Q 12 22 20 19" stroke="var(--color-tulsi)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/**
 * KalashIcon: Auspicious holy pitcher carrying consecrated Pushkar water.
 */
export const KalashIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pot base */}
    <path d="M 7 11 C 4.5 15 5.5 21 12 21 C 18.5 21 19.5 15 17 11 Z" fill="var(--color-haldi)" stroke="var(--color-mitti)" strokeWidth="1.3" />
    {/* Swastika/Auspicious lines on pot */}
    <line x1="12" y1="13" x2="12" y2="19" stroke="var(--color-kumkum)" strokeWidth="1" />
    <line x1="9" y1="16" x2="15" y2="16" stroke="var(--color-kumkum)" strokeWidth="1" />
    {/* Rim */}
    <ellipse cx="12" cy="11" rx="5" ry="1.8" fill="var(--color-kesari)" />
    {/* Mango leaves */}
    <path d="M 12 10 L 7 5 M 12 10 L 17 5 M 12 10 L 12 4" stroke="var(--color-tulsi)" strokeWidth="1.8" strokeLinecap="round" />
    {/* Sacred Coconut with Tilak */}
    <circle cx="12" cy="5.5" r="3.2" fill="var(--color-mitti)" />
    <circle cx="12" cy="5.5" r="1.2" fill="var(--color-kumkum)" />
  </svg>
);

/**
 * KolamDivider: Authentic Andhra kolam/muggu dot-and-line sacred divider.
 */
export const KolamDivider: React.FC<{ className?: string }> = ({ className = 'my-6' }) => (
  <div className={`flex items-center justify-center gap-3 w-full opacity-75 ${className}`} aria-hidden="true">
    <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-haldi to-kesari" />
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="10" r="3" fill="var(--color-kumkum)" />
      <circle cx="16" cy="10" r="2" fill="var(--color-haldi)" />
      <circle cx="44" cy="10" r="2" fill="var(--color-haldi)" />
      <path d="M 22 10 Q 30 3 38 10 Q 30 17 22 10 Z" stroke="var(--color-kesari)" strokeWidth="1.4" fill="none" />
      <path d="M 8 10 Q 16 5 24 10 M 36 10 Q 44 15 52 10" stroke="var(--color-haldi)" strokeWidth="1.2" />
    </svg>
    <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-haldi to-kesari" />
  </div>
);

/**
 * KolamCorner: Traditional decorative rangoli corner flourish for card frames.
 */
export const KolamCorner: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-haldi' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M 2 2 L 14 2 C 14 8, 8 14, 2 14 Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <circle cx="6" cy="6" r="1.8" fill="var(--color-kumkum)" />
  </svg>
);

/**
 * RiverWaves: Gentle sacred ripples of the holy Godavari.
 */
export const RiverWaves: React.FC<{ className?: string }> = ({ className = 'w-full h-8 text-godavari' }) => (
  <svg viewBox="0 0 600 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    <path
      d="M 0 10 Q 30 4 60 10 T 120 10 T 180 10 T 240 10 T 300 10 T 360 10 T 420 10 T 480 10 T 540 10 T 600 10"
      stroke="currentColor"
      strokeWidth="2.2"
      opacity="0.5"
      strokeLinecap="round"
    />
    <path
      d="M 0 19 Q 30 13 60 19 T 120 19 T 180 19 T 240 19 T 300 19 T 360 19 T 420 19 T 480 19 T 540 19 T 600 19"
      stroke="currentColor"
      strokeWidth="2.8"
      opacity="0.85"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * RakshaSutraThread: Sacred Mauli protective thread with alternating vermilion and turmeric strands.
 */
export const RakshaSutraThread: React.FC<{ className?: string }> = ({ className = 'h-1.5 w-full' }) => (
  <div
    className={`sutra-divider ${className}`}
    role="separator"
    aria-hidden="true"
  />
);

/**
 * ShlokaBanner: Sacred River Godavari invocation shloka presented in Sanskrit, Telugu, and Hindi.
 */
export const ShlokaBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-kesari-light via-haldi-light to-chandan border-2 border-haldi/60 text-center shadow-sm select-none ${className}`}>
    <div className="text-xs sm:text-sm font-serif font-bold text-kumkum tracking-wide">
      గంగే చ యమునే చైవ గోదావరి సరస్వతీ | నర్మదే సింధు కావేరీ జలేస్మిన్ సన్నిధిం కురు ||
    </div>
    <div className="text-[11px] sm:text-xs font-serif text-mitti mt-0.5">
      गङ्गे च यमुने चैव गोदावरि सरस्वति | नर्मदे सिन्धु कावेरी जलेऽस्मिन् सन्निधिं कुरु ||
    </div>
    <div className="text-[10px] text-ink-muted mt-1 uppercase tracking-widest font-sans font-semibold">
      • PUSHKARALU MAHA SANGAMAM • RAJAMAHENDRAVARAM 2027 •
    </div>
  </div>
);
